## Why

The Google Sheets export schema is missing audit timestamps and lacks a populated data source identifier, making it impossible to track when a product record was scraped or which source it came from when the data lands in Supabase. Adding `item_created_at`, `item_updated_at`, and fixing `item_data_source` closes this gap so every exported row is self-describing and ready for direct import into Postgres.

## What Changes

- Add `item_created_at` column to `GOOGLE_SHEETS_SCHEMA` after `item_note` — ISO 8601 timestamp in `Europe/Copenhagen` timezone, PostgreSQL-compatible
- Add `item_updated_at` column to `GOOGLE_SHEETS_SCHEMA` after `item_created_at` — same format, set to the same scrape-time value as `item_created_at` on creation
- Fix `item_data_source` resolver — currently always emits an empty string; change it to emit the matching `SourceEntry.domain` value from `sourceRegistry` for the scraped URL
- Extend `ScrapeDataRow` with a `dataSource` field so the resolved domain is propagated from `scraper.ts` through to `googleSheetsAppender.ts`

## Capabilities

### New Capabilities
- `sheets-timestamp-columns`: `item_created_at` and `item_updated_at` columns appended to the Google Sheets schema, formatted as Supabase/PostgreSQL-compatible ISO 8601 timestamps localised to `Europe/Copenhagen`

### Modified Capabilities
- `google-sheets-column-schema-alignment`: Schema extended with two new tail columns and `item_data_source` resolver corrected to emit the sourceRegistry domain value

## Impact

- `scraper/src/helpers/googleSheetsAppender.ts` — `GOOGLE_SHEETS_SCHEMA`, `EXPECTED_GOOGLE_SHEETS_COLUMN_COUNT`, and `createColumnResolvers` all change; new timestamp generation logic added
- `scraper/src/interfaces/scrapeResult.ts` — `ScrapeDataRow` extended with `dataSource: string`
- `scraper/src/scraper.ts` — `scrapeUrl` must resolve and attach `dataSource` via `findSource(url).domain` when building the `ScrapeDataRow`
- No new dependencies; `Intl.DateTimeFormat` / `Date` APIs used for timezone-aware timestamp formatting
- No Supabase schema migration required at this stage — columns are written into Google Sheets as strings; Supabase import is a future concern
