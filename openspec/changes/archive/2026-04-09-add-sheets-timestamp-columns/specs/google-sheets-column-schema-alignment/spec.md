## MODIFIED Requirements

### Requirement: Chronological Google Sheets schema serialization
The scraper export pipeline MUST serialize each appended row according to the full chronological `item_*` Google Sheets schema provided for product composition exports, including the `item_sugar_g_per_100g` column positioned within the nutrition column block, the `item_data_source` column populated with the `SourceEntry.domain` string resolved for the scraped URL, and the `item_created_at` and `item_updated_at` timestamp columns appended as the final two columns after `item_note`.

#### Scenario: Full schema order is enforced with timestamps and data source
- **WHEN** the appender builds a row for a scraped product
- **THEN** it serializes values strictly in the defined chronological column sequence from `item_id` through `item_note`, followed by `item_created_at` and `item_updated_at`, with `item_sugar_g_per_100g` placed after `item_water_g_per_100g`

#### Scenario: Data source column populated from sourceRegistry
- **WHEN** the appender builds a row for a product scraped from a registered URL
- **THEN** `item_data_source` contains the `domain` string from the matching `SourceEntry` in `sourceRegistry` (e.g. `'zooplus'`, `'emea.acana'`)

## ADDED Requirements

### Requirement: item_data_source populated from ScrapeDataRow
The scraper export pipeline MUST populate `item_data_source` from the `dataSource` field on `ScrapeDataRow`, which SHALL be set to the `SourceEntry.domain` value resolved in `scraper.ts` at scrape time.

#### Scenario: Registered source domain written to sheet
- **WHEN** `scrapeUrl` processes a URL whose domain matches a `SourceEntry`
- **THEN** the resulting `ScrapeDataRow.dataSource` equals the matching `SourceEntry.domain` and the built row writes that value into the `item_data_source` column

#### Scenario: Unregistered URL throws before row is built
- **WHEN** `scrapeUrl` receives a URL that does not match any `SourceEntry`
- **THEN** an error is thrown and no row is written to Google Sheets
