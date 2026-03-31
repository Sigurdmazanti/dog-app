## 1. Google Sheets header contract

- [x] 1.1 Define the complete chronological `item_*` header array in `scraper/src/helpers/googleSheetsAppender.ts` from `item_id` through `item_note`.
- [x] 1.2 Add a deterministic row-builder that iterates the canonical header array and resolves each header value in-order.
- [x] 1.3 Ensure row length and header count are validated before append to prevent positional drift.
- [x] 1.4 Verification: run the scraper append path with a sample payload and confirm generated row positions align exactly to the new header order.

## 2. Field mapping and compatibility bridges

- [x] 2.1 Update composition key-to-column mappings so renamed/new columns resolve to the correct canonical data fields.
- [x] 2.2 Implement explicit compatibility mappings for renamed destination headers where canonical source keys differ.
- [x] 2.3 Ensure missing values produce explicit empty/null-safe cells without changing neighboring column positions.
- [x] 2.4 Verification: validate rows produced from partial data keep stable ordering and fixed-length shape.

## 3. AI mapping alignment

- [x] 3.1 Update AI-to-canonical mapping assumptions in `scraper/src/helpers/aiProductCompositionMapper.ts` and related interfaces/helpers so exporter-required fields remain reachable.
- [x] 3.2 Align any shared key maps (for example `productCompositionKeyMap.ts`) with expanded trace elements and vitamin fields used by the new export schema.
- [x] 3.3 Verify fallback behavior keeps canonical keys present when AI output is incomplete or null for expanded fields.
- [x] 3.4 Verification: run end-to-end mapping + append flow and confirm renamed/new `item_*` columns are populated or null-safe without schema breaks.

## 4. Documentation and regression checks

- [x] 4.1 Update scraper README or in-file docs to describe the new Google Sheets column contract and ordering requirement.
- [x] 4.2 Capture a representative sample export row for maintainers to compare future schema changes against.
- [x] 4.3 Verification: execute project checks used by scraper workflows and confirm no regressions in existing export behavior.
