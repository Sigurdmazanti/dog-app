## Context

The scraper exports product data into a Google Sheet that acts as the downstream source for analysis and manual review. The current export path spans multiple modules (scraper output, mapping helpers, interfaces, and the append helper), so schema drift can happen when a new nutrient field is introduced or a field is renamed in only one layer.

The user-provided sheet header defines a strict positional contract. If exported rows are generated from ad hoc field access instead of one canonical ordered definition, values can shift into incorrect columns without obvious runtime failure.

## Goals / Non-Goals

**Goals:**
- Introduce one canonical, ordered export schema for all Google Sheets row generation.
- Ensure every `item_*` column name used in appending has a matching typed source field or explicit fallback.
- Add validation that prevents appending when row length or field mapping does not match the schema.
- Make field naming conventions explicit and enforceable across interfaces and helpers.
- Expand mineral coverage with 11 new trace-element columns and keep deterministic placement in the canonical order.
- Publish an insertion-ready full header order for maintainers to apply directly in Google Sheets.

**Non-Goals:**
- Redesign scraping logic for vendor-specific extraction quality.
- Change Google Sheets credential/auth flow.
- Refactor unrelated nutrition calculations beyond export alignment.
- Introduce UI or mobile-app changes (this is scraper-only).

## Decisions

1. Canonical column contract file
- Decision: Define a single ordered list of Google Sheets columns as the source of truth for row generation.
- Rationale: Eliminates duplication and implicit ordering assumptions.
- Alternative considered: Keep manual row array assembly in appender. Rejected due to high drift risk.

2. Schema-driven row builder
- Decision: Build append rows by iterating the canonical column list and mapping values by exact key name.
- Rationale: Guarantees positional order and makes missing-field behavior explicit.
- Alternative considered: Object spread plus `Object.values`. Rejected because key order becomes brittle and unclear for long schemas.

3. Fail-fast validation
- Decision: Validate row width and required identity fields before append; throw descriptive errors on mismatch.
- Rationale: Prevents silent data corruption in Sheets.
- Alternative considered: Log-only warnings. Rejected because append would still write bad data.

4. Naming normalization boundary
- Decision: Preserve exact Google Sheet header names at export boundary (`item_*`), while allowing internal helper naming only if mapped explicitly.
- Rationale: Keeps external contract stable and readable while not forcing broad internal renames.
- Alternative considered: Rename all internal types to header names immediately. Rejected as unnecessary blast radius.

5. Coverage audit checklist
- Decision: Add an implementation checklist to verify each column is sourced (scraped, calculated, defaulted, or intentionally blank).
- Rationale: Prevents hidden gaps in less common nutrient fields.
- Alternative considered: Rely on manual spot checks. Rejected due to inconsistency.

6. New mineral naming and placement
- Decision: Name all new trace-element columns as `item_<english_name>_per_100g` and place them in the minerals block immediately after `item_sulphur_per_100g` and before `item_iron_per_100g`.
- Rationale: Preserves the existing minerals-first grouping while avoiding mixed placement with salts or vitamins.
- Alternative considered: Append all new columns at the end. Rejected because domain grouping becomes unclear and harder to maintain.

## Risks / Trade-offs

- [Risk] Canonical schema changes can break existing append behavior immediately. -> Mitigation: include explicit migration/update steps and test fixtures for row ordering.
- [Risk] Some fields may be unavailable from source websites, causing frequent validation failures. -> Mitigation: classify fields as required vs optional and provide explicit empty defaults for optional columns.
- [Risk] Strict enforcement may slow quick schema tweaks by maintainers. -> Mitigation: document one update path (schema list + mapper + fixture) to keep maintenance predictable.
- [Risk] Hidden coupling with downstream sheet formulas relying on old misalignment. -> Mitigation: communicate rollout and verify with a small sample append before full runs.

## Migration Plan

1. Define canonical ordered export column contract.
2. Add the 11 new trace-element mineral columns to the canonical order.
3. Update appender to generate rows from this contract.
4. Align interfaces/mappers for naming and source coverage.
5. Add validation and checks for column count and ordered mapping.
6. Run sample scrape and append in dry-run/controlled mode.
7. Roll forward with monitored append runs.

Rollback strategy:
- Revert to previous appender implementation and schema contract file in one commit if critical append failures occur.
- Keep raw scrape outputs for replay so rows can be regenerated after fix.

## Open Questions

- Which columns are truly required for append acceptance versus optional blank-able fields?
- Should unknown/unmapped columns fail hard always, or fail only in CI and warn locally?
- Do downstream sheet formulas depend on current historical misalignment in any column positions?
