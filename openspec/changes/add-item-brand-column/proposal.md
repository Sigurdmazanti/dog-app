## Why

The Google Sheets export currently identifies a product's origin only via `item_data_source`, which stores a raw URL domain fragment (e.g. `"www.acana.com"`). There is no clean, human-readable brand name associated with each product row, making it difficult to filter, group, or present data by brand.

## What Changes

- Add a `brand` field to `SourceEntry` in `sourceRegistry.ts` — one brand name per registered source
- Add `brand` to `ScrapeDataRow` so it flows through the scrape pipeline
- Add `item_brand` column to the Google Sheets schema and row builder
- Populate brand values for all existing registered sources

## Capabilities

### New Capabilities
- `scraper-item-brand`: Brand name field on registered scraper sources, propagated through the scrape row and exported as `item_brand` in Google Sheets

### Modified Capabilities
- `google-sheets-column-schema-alignment`: The `item_brand` column is added to the chronological export schema
- `scraped-product-composition-export`: `ScrapeDataRow` gains a `brand` field sourced from `SourceEntry.brand`

## Impact

- `scraper/src/sourceRegistry.ts` — `SourceEntry` interface gains `brand: string`; all registered entries need a brand value
- `scraper/src/interfaces/scrapeResult.ts` — `ScrapeDataRow` gains `brand: string`
- `scraper/src/scraper.ts` — `brand` copied from matched `SourceEntry` into `ScrapeDataRow`
- `scraper/src/helpers/googleSheetsAppender.ts` — `item_brand` added to `GOOGLE_SHEETS_SCHEMA` and column resolver
