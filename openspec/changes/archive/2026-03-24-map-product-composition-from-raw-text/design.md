## Context

The current scraper mapping flow assumes composition input is pre-parsed into structured name/value entries before calling AI mapping. This assumption is brittle because supplier pages often provide nutritional and additive values inside mixed prose blocks rather than tables. Acana EU is a representative case where useful nutrient values are present in text, but the current parser path cannot reliably produce complete entry rows for mapping.

The desired change is to make text the primary mapping input while preserving the canonical output schema consumed by downstream export and Google Sheets append logic. This is a scraper-side change and does not alter mobile runtime behavior.

## Goals / Non-Goals

**Goals:**
- Accept unstructured composition text as mapper input.
- Preserve canonical output sections and keys used by existing export flows.
- Keep strict response validation and fallback-safe behavior.
- Improve mapping reliability when structured HTML tables are missing.

**Non-Goals:**
- Redefining canonical composition field names.
- Reworking Google Sheets export schema.
- Introducing new external AI providers or new runtime dependencies.
- Changing app UI, navigation, auth, or mobile state management.

## Decisions

1. Mapper input contract changes from entry arrays to text-first input.
- Decision: Replace the current mapper API with a text-oriented function (for example, raw composition text and optional source metadata).
- Rationale: Text is the most consistently available source across scraper targets.
- Alternative considered: Keep row input and add per-scraper text-to-row preprocessing. Rejected because it duplicates parsing logic and remains fragile for varied vendor wording.

2. Canonical schema remains unchanged.
- Decision: Continue returning the same composition section structure and canonical keys.
- Rationale: This avoids downstream breakage in exporter and sheet mapping logic.
- Alternative considered: Introduce text-specific intermediate schema. Rejected because it adds complexity without improving consumer contracts.

3. AI-first with deterministic fallback remains.
- Decision: Keep AI mapping as primary when configured, with strict parse/validate checks and empty canonical-section fallback on failure.
- Rationale: Maintains resiliency while avoiding brittle, website-specific heuristic pre-parsing across many sources.
- Alternative considered: AI-only hard failure. Rejected because scrape jobs should remain robust when model output is invalid or unavailable.

4. Prompting explicitly targets text extraction constraints.
- Decision: Update prompt rules to instruct extraction from prose lines, unit normalization, and derived totals (for vitamin D and K aggregates) from free text sources.
- Rationale: Free text requires clearer extraction instructions than table-shaped inputs.
- Alternative considered: Minimal prompt changes. Rejected due to increased risk of incomplete mappings.

## Risks / Trade-offs

- [Risk] Free text ambiguity may produce inconsistent AI interpretation for similarly worded nutrient lines. -> Mitigation: keep strict schema validation, explicit prompt rules, and safe empty-schema fallback.
- [Risk] Signature change can break existing scraper call sites. -> Mitigation: migrate scrapers incrementally and provide a compatibility wrapper during rollout if needed.
- [Risk] Token usage may increase with large composition text blocks. -> Mitigation: trim irrelevant boilerplate and keep timeout/retry safeguards.
- [Risk] IU and mixed unit conversions can be under-specified by source pages. -> Mitigation: define explicit handling rules and set unknown conversions to null.

## Migration Plan

1. Update mapper interface and internals to accept text input and produce the unchanged canonical output sections.
2. Migrate Acana EU scraper to pass raw composition text directly.
3. Preserve and verify empty canonical fallback path for AI-disabled and AI-failure scenarios.
4. Validate one end-to-end scrape run with append flow to ensure downstream compatibility.
5. Roll back by restoring prior mapper entry-input function and scraper call path if regression is detected.

## Open Questions

- Should the mapper accept one combined text blob or separate blocks (composition, additives, energy) to improve extraction precision?
- Should we support an optional secondary model pass for low-confidence outputs, or keep single-pass AI extraction only?
- Do we want source-specific text cleanup hooks before prompting (for example removing certification/legal paragraphs)?
