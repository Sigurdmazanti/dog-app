## Purpose

Define how the scraper export pipeline serializes rows to Google Sheets using a deterministic chronological column schema with migration support for renamed columns.

## Requirements

### Requirement: Chronological Google Sheets schema serialization
The scraper export pipeline MUST serialize each appended row according to the full chronological `item_*` Google Sheets schema provided for product composition exports, including the `item_sugar_g_per_100g` column positioned within the nutrition column block.

#### Scenario: Full schema order is enforced
- **WHEN** the appender builds a row for a scraped product
- **THEN** it serializes values strictly in the defined chronological column sequence from `item_id` through `item_note`, with `item_sugar_g_per_100g` placed after `item_water_g_per_100g`

### Requirement: Deterministic row shape for incomplete data
The export pipeline MUST emit a fixed-length row for every append operation, even when some source values are missing.

#### Scenario: Missing sugar value
- **WHEN** a product has no available value for sugar content
- **THEN** the appender writes an empty/null-safe placeholder in the `item_sugar_g_per_100g` column position and preserves full row length

### Requirement: Field-name migration compatibility
The export pipeline MUST support target column-name changes through explicit mapping so renamed destination headers continue to receive the intended canonical values.

#### Scenario: Destination header renamed from previous schema
- **WHEN** a destination header differs from the previous export contract
- **THEN** the appender resolves the corresponding canonical source value into the new header without requiring positional fallback or manual spreadsheet edits
