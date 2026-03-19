## Context

The scraper pipeline currently extracts a limited set of product composition attributes, while source pages frequently expose additional nutrient and additive labels using multilingual or synonym-heavy naming. These missing values reduce downstream analytics quality in Google Sheets and create manual normalization work.

The requested change spans multiple modules in the scraper package:
- interface contracts for product composition and scrape result payloads
- label-to-field normalization maps
- per-source scraping/parsing logic
- fallback/default handling in orchestrator flow
- Google Sheets row serialization

## Goals / Non-Goals

**Goals:**
- Introduce typed model coverage for the requested data groups: minerals, salts, vitamins (including B variants), amino-acid derivatives, vitamin-like compounds, fatty acids, and sugar alcohols.
- Normalize synonym/locale variants to canonical keys using alias maps where the first listed label is canonical and remaining labels are accepted aliases.
- Ensure scrape outputs remain structurally stable even when source pages omit some values.
- Export all newly modeled fields to Google Sheets in deterministic column order aligned with existing comment markers.

**Non-Goals:**
- Adding new scraper sources beyond current implementations.
- Reworking numeric unit conversion beyond existing parser conventions.
- Altering mobile app runtime behavior (this change is scraper-only).

## Decisions

1. Canonical-first alias mapping strategy
- Decision: In key-map files, each target field uses a canonical identifier derived from the first label in the user-provided slash list, with all remaining slash labels added as aliases.
- Rationale: Keeps mapping deterministic and human-auditable while supporting multilingual labels and supplier-specific naming.
- Canonical naming rule: Interface property names remain English even when aliases are Danish (for example `phosphorus` with aliases `fosfor`, `phosphate`).
- Alternative considered: fuzzy matching only. Rejected due to higher false-positive risk and lower predictability.

2. Grouped composition models in interfaces
- Decision: Add explicit grouped interfaces (minerals/salts/vitamins/etc.) in product composition contracts instead of flat ungrouped expansion.
- Rationale: Improves maintainability, readability, and export mapping consistency when new groups are added later.
- Alternative considered: single flat map. Rejected due to weaker type safety and harder sheet mapping evolution.

3. Null-safe pipeline contract with orchestrator fallbacks
- Decision: Keep parser extraction best-effort and enforce stable output shape by applying fallbacks in scraper orchestration.
- Rationale: Source pages vary; orchestration-level defaults prevent missing-property regressions in downstream append logic.
- Alternative considered: enforce strict parser completeness and fail rows. Rejected because partial data is still valuable.

Fallback application sequence in `scraper.ts`:

```ts
applyNumericFallbacks('nutritionData', data.nutritionData, nutritionKeyMap, noteText);
applyNumericFallbacks('mineralsData', data.mineralsData, mineralsKeyMap, noteText);
applyNumericFallbacks('saltsData', data.saltsData, saltsKeyMap, noteText);
applyNumericFallbacks('vitaminsData', data.vitaminsData, vitaminsKeyMap, noteText);
applyNumericFallbacks('aminoAcidsData', data.aminoAcidsData, aminoAcidsKeyMap, noteText);
applyNumericFallbacks('vitaminLikeData', data.vitaminLikeData, vitaminLikeKeyMap, noteText);
applyNumericFallbacks('fattyAcidsData', data.fattyAcidsData, fattyAcidsKeyMap, noteText);
applyNumericFallbacks('sugarAlcoholsData', data.sugarAlcoholsData, sugarAlcoholsKeyMap, noteText);
```

4. Explicit Google Sheets column wiring
- Decision: Map each new field explicitly in appender row composition and preserve existing marker/comment intent.
- Rationale: Prevents accidental column drift and keeps spreadsheet semantics transparent.
- Alternative considered: dynamic object iteration. Rejected because ordering and compatibility with existing sheet formulas would be fragile.

## Risks / Trade-offs

- [Risk] Alias collisions where one source label could map to multiple nutrients.
  → Mitigation: keep mapping table explicit and review overlap cases in manual scrape verification.
- [Risk] Column-order mistakes could shift existing sheet data.
  → Mitigation: validate row length and column position with manual append checks for legacy + new fields.
- [Risk] Inconsistent units across products (mg, mcg, %, IU).
  → Mitigation: preserve raw parsed values and only apply existing normalization logic to avoid accidental reinterpretation.
- [Trade-off] Larger interface and appender code surface.
  → Mitigation: organize by groups and keep naming canonical-first for discoverability.
