## Purpose

Define how the scraper export pipeline serializes rows to Google Sheets using a deterministic chronological column schema with migration support for renamed columns.

## Requirements

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

### Requirement: item_data_source populated from ScrapeDataRow
The scraper export pipeline MUST populate `item_data_source` from the `dataSource` field on `ScrapeDataRow`, which SHALL be set to the `SourceEntry.domain` value resolved in `scraper.ts` at scrape time.

#### Scenario: Registered source domain written to sheet
- **WHEN** `scrapeUrl` processes a URL whose domain matches a `SourceEntry`
- **THEN** the resulting `ScrapeDataRow.dataSource` equals the matching `SourceEntry.domain` and the built row writes that value into the `item_data_source` column

#### Scenario: Unregistered URL throws before row is built
- **WHEN** `scrapeUrl` receives a URL that does not match any `SourceEntry`
- **THEN** an error is thrown and no row is written to Google Sheets
