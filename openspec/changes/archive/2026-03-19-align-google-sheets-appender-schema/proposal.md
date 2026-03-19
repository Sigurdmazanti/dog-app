## Why

The scraper currently risks writing product rows to Google Sheets in an order that can drift from the sheet header contract, which can silently misplace nutrient values and metadata. This needs to be formalized now so data exports stay reliable as new nutrient fields and mappings are added.

## What Changes

- Define a strict, canonical Google Sheets export schema for scraper output that matches the sheet column order exactly.
- Require the appender to build rows from a single ordered column contract instead of implicit object/key ordering.
- Add validation behavior that fails fast when exported row length or field mapping diverges from the schema.
- Standardize naming conventions for sheet-bound fields (`item_*` prefix and exact per-column naming) across interfaces, mappers, and append logic.
- Audit scraper data flow to identify and close gaps where expected sheet columns are not produced, transformed, or forwarded.
- Add new mineral trace-element columns (cobalt, molybdenum, fluorine, silicon, chromium, vanadium, nickel, tin, arsenic, lead, cadmium) with canonical export names.
- Publish a complete insertion-ready Google Sheets header order that includes all legacy and new columns.
- Extend scraper models and key mappers so new fields are handled through the same reusable alias-matching pipeline.

## Capabilities

### New Capabilities
- `scraper-google-sheets-export-schema`: Defines and enforces the ordered sheet export contract, including required field names and row validation for appending.

### Modified Capabilities
- `metabolizable-energy-calculation`: Clarifies how computed nutrition fields are preserved and exported within the enforced sheet schema without column drift.

## Impact

- Affected systems: `scraper` ingestion, mapping, and Google Sheets append pipeline.
- Affected files: scraper interfaces, nutrition/mapping helpers, and sheet append helper.
- External integration impact: Google Sheets append behavior becomes schema-enforced and fail-fast on mismatch.
- Runtime behavior: malformed or incomplete rows are surfaced immediately instead of silently appending misaligned data.
- Data schema impact: Google Sheets contract expands from 55 to 66 columns.
