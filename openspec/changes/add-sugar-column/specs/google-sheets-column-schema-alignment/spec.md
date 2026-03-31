## MODIFIED Requirements

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
