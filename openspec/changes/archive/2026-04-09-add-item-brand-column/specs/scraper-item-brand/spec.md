## ADDED Requirements

### Requirement: Brand field on SourceEntry
Every `SourceEntry` in `sourceRegistry.ts` MUST declare a `brand: string` field containing the human-readable brand name for the data source.

#### Scenario: Brand field is present on all registered sources
- **WHEN** a developer inspects any `SourceEntry` object in `sourceRegistry.ts`
- **THEN** a non-empty `brand` string property is present on the entry

#### Scenario: Brand field is required, not optional
- **WHEN** a new `SourceEntry` is added without a `brand` property
- **THEN** the TypeScript compiler raises a type error

### Requirement: Brand propagated to ScrapeDataRow
The `brand` field from the matched `SourceEntry` MUST be assigned to `ScrapeDataRow.brand` when `scrapeUrl` builds the data row.

#### Scenario: Brand copied from registry into data row
- **WHEN** `scrapeUrl` resolves a URL to a `SourceEntry` and builds the `ScrapeDataRow`
- **THEN** `ScrapeDataRow.brand` equals the `brand` string from the matching `SourceEntry`

### Requirement: item_brand exported to Google Sheets
The Google Sheets appender MUST write `ScrapeDataRow.brand` to an `item_brand` column positioned after `item_name` and before `item_url`.

#### Scenario: item_brand column populated with brand name
- **WHEN** the appender builds a row for a scraped product
- **THEN** the `item_brand` column contains the brand string from `ScrapeDataRow.brand`

#### Scenario: item_brand appears after item_name
- **WHEN** the appender serializes a row
- **THEN** `item_brand` is positioned immediately after `item_name` in the output row
