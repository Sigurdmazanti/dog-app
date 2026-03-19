## 1. Google Sheets schema contract

- [x] 1.1 Add a canonical ordered column contract for all Google Sheets export fields, matching the approved header list exactly.
- [x] 1.2 Document required vs optional columns in the schema contract (including identity fields and nutrient fields).
- [x] 1.3 Add verification for schema contract integrity (no duplicates, stable ordering, expected column count).
- [x] 1.4 Add the 11 new mineral columns to the canonical schema: cobalt, molybdenum, fluorine, silicon, chromium, vanadium, nickel, tin, arsenic, lead, cadmium.
- [x] 1.5 Publish the full 66-column header order in specification artifacts for direct Google Sheets insertion.

## 2. Appender alignment

- [x] 2.1 Refactor the Google Sheets appender to build output rows by iterating the canonical schema contract.
- [x] 2.2 Add fail-fast validation that blocks append when row width does not equal schema column count.
- [ ] 2.3 Add fail-fast validation for missing required identity fields (`item_id`, `item_name`, `item_data_source`).
- [ ] 2.4 Add verification task: run scraper append flow against a controlled sample and confirm positional alignment with sheet headers.
Note: `2.3` is intentionally not implemented because current agreed behavior is `item_id` and `item_data_source` must stay empty.

## 3. Naming and mapping consistency

- [x] 3.1 Audit scraper interfaces and helper types to ensure sheet-bound fields use exact `item_*` naming at the export boundary.
- [x] 3.2 Implement explicit mapping for any internally named fields that differ from sheet header names.
- [x] 3.3 Ensure metabolizable energy values map to `item_kj_per_100g` without shifting adjacent fields.
- [x] 3.4 Extend mineral models with new fields for cobalt, molybdenum, fluorine, silicon, chromium, vanadium, nickel, tin, arsenic, lead, and cadmium.
- [x] 3.5 Extend key mappers with aliases for all new fields and ensure matching works for both Danish and English labels.
- [x] 3.6 Verify new fields flow through the existing scrape -> map -> fallback -> append pipeline without adding custom one-off parsing logic.

## 4. Coverage and regression checks

- [x] 4.1 Build a per-column coverage checklist showing whether each schema field is scraped, derived, defaulted, or intentionally blank.
- [ ] 4.2 Run scraper validation with representative products and verify all new columns remain positionally aligned in output rows.
- [ ] 4.3 Add verification task: run full scraper validation checks and confirm no append occurs on schema mismatch.
