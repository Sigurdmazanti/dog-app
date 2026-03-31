## Context

The scraper currently appends product rows to Google Sheets using an older column contract. The target sheet schema has changed to a new chronological set of `item_*` headers, including renamed fields and additional nutrient/micronutrient columns. If the appender keeps using legacy headers or partial maps, appended rows can shift columns, lose values, or fail downstream analysis.

The change is isolated to scraper export and mapping behavior. No mobile UI flow, Supabase auth, or database schema is changed.

## Goals / Non-Goals

**Goals:**
- Make row serialization fully compatible with the new Google Sheets header contract.
- Guarantee deterministic output order that exactly matches the provided chronological column sequence.
- Map all newly introduced columns from canonical composition data where available.
- Preserve stable row shape when values are missing by emitting explicit empty/null-safe cells in-place.
- Keep existing scraper ingestion and parsing behavior intact outside export contract alignment.

**Non-Goals:**
- Redesigning scraper extraction logic for source websites.
- Changing Supabase schema or auth integration.
- Introducing new runtime dependencies or spreadsheet write providers.
- Altering mobile client presentation logic.

## Decisions

1. Canonical export header array in chronological order
- Decision: Define one authoritative ordered header list for the new `item_*` schema and use it to build every row.
- Rationale: A single source of truth prevents accidental column drift when mappings evolve.
- Alternative considered: Building rows from object key iteration. Rejected because key order is less explicit and easier to regress during refactors.

2. Header-to-value resolver map with null-safe fallback
- Decision: Resolve each header through a dedicated mapping function/table that returns either normalized value or empty/null-safe value.
- Rationale: Isolates transformation logic per field and guarantees every column position is populated deterministically.
- Alternative considered: Inline positional array construction. Rejected due to poor maintainability and high risk when fields are added/renamed.

3. Preserve canonical units and naming in mapping layer
- Decision: Keep unit-specific fields mapped exactly to target names (`_g_per_100g`, `_mg_per_100g`, `_ug_per_100g`) without implicit conversion.
- Rationale: Avoids silent numeric errors and keeps exported semantics predictable.
- Alternative considered: Auto-conversion between mass units in exporter. Rejected because unit assumptions are unsafe without explicit source metadata.

4. Compatibility bridge for renamed column keys
- Decision: Introduce explicit key remapping for renamed labels (for example legacy chlorine/chloride style differences) so canonical data can still populate new headers.
- Rationale: Supports schema migration without forcing immediate upstream parser rewrites.
- Alternative considered: Renaming all upstream canonical keys first. Rejected for now to reduce blast radius and keep migration incremental.

## Risks / Trade-offs

- [Risk] Large header set increases maintenance burden and typo risk in manual mappings. -> Mitigation: keep one ordered constant and one resolver map, then validate lengths/known keys before append.
- [Risk] Some new columns may not exist in current source data for many products. -> Mitigation: emit null-safe placeholders while keeping exact column positions.
- [Risk] Divergence between AI mapper canonical keys and exporter target keys can leave fields empty. -> Mitigation: align key map definitions and add explicit bridge mappings for renamed fields.
- [Risk] Silent regressions if order changes accidentally during future edits. -> Mitigation: validate row length and enforce serialization directly from the canonical ordered header array.
