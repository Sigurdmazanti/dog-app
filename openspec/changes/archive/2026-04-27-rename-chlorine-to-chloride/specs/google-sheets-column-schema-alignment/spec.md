## MODIFIED Requirements

### Requirement: Chronological Google Sheets schema serialization
The scraper export pipeline MUST serialize each appended row according to the full chronological `item_*` Google Sheets schema provided for product composition exports, including an `item_brand` column positioned immediately after `item_name`, the `item_sugar_g_per_100g` column positioned within the nutrition column block, the `item_data_source` column populated with the `SourceEntry.domain` string resolved for the scraped URL, the `item_created_at` and `item_updated_at` timestamp columns appended as the final two columns after `item_note`, and the mineral column for chloride named `item_chloride_mg_per_100g`.

#### Scenario: Full schema order is enforced with timestamps and data source
- **WHEN** the appender builds a row for a scraped product
- **THEN** it serializes values strictly in the defined chronological column sequence from `item_id` through `item_note`, followed by `item_created_at` and `item_updated_at`, with `item_brand` placed immediately after `item_name`, `item_sugar_g_per_100g` placed after `item_water_g_per_100g`, and the chloride column emitted as `item_chloride_mg_per_100g`

#### Scenario: Data source column populated from sourceRegistry
- **WHEN** the appender builds a row for a product scraped from a registered URL
- **THEN** `item_data_source` contains the `domain` string from the matching `SourceEntry` in `sourceRegistry` (e.g. `'zooplus'`, `'emea.acana'`)

#### Scenario: Brand column populated from sourceRegistry
- **WHEN** the appender builds a row for a product scraped from a registered URL
- **THEN** `item_brand` contains the `brand` string from the matching `SourceEntry` (e.g. `'Acana'`, `'Zooplus'`)
