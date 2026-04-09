## 1. scrapeResult.ts — Extend ScrapeDataRow interface

- [x] 1.1 Add `dataSource: string` field to the `ScrapeDataRow` interface in `scraper/src/interfaces/scrapeResult.ts`
- [x] 1.2 Verify TypeScript compilation reports errors for any existing `ScrapeDataRow` literal that is missing `dataSource` (to locate all callsites)

## 2. scraper.ts — Populate dataSource on ScrapeDataRow

- [x] 2.1 In `scrapeUrl`, after the `source` is resolved via `findSource(url)`, attach `dataSource: source.domain` when constructing the `ScrapeDataRow` spread in `scraper/src/scraper.ts`
- [x] 2.2 Verify TypeScript compilation passes with no errors in the scraper package (`npx tsc --noEmit`)

## 3. googleSheetsAppender.ts — Add timestamp utility

- [x] 3.1 Add a `formatCopenhagenTimestamp(date: Date): string` helper in `scraper/src/helpers/googleSheetsAppender.ts` that returns an ISO 8601 string with the UTC offset for `Europe/Copenhagen` (DST-aware) using `Intl.DateTimeFormat` with `formatToParts`

## 4. googleSheetsAppender.ts — Update GOOGLE_SHEETS_SCHEMA

- [x] 4.1 Append `'item_created_at'` and `'item_updated_at'` to `GOOGLE_SHEETS_SCHEMA` in `scraper/src/helpers/googleSheetsAppender.ts`, after `'item_note'`

## 5. googleSheetsAppender.ts — Update createColumnResolvers

- [x] 5.1 Change `item_data_source` resolver from `''` to `toColumnValue(dataRow.dataSource)` in `createColumnResolvers`
- [x] 5.2 Add `item_created_at` and `item_updated_at` resolvers: capture `new Date()` once as `scrapedAt`, then assign `formatCopenhagenTimestamp(scrapedAt)` to both columns
- [x] 5.3 Verify `Object.keys(columnResolvers).length` still matches `GOOGLE_SHEETS_SCHEMA.length` (the existing runtime guard in `buildGoogleSheetsRow` will catch any mismatch)

## 6. Verification

- [x] 6.1 Run `npx tsc --noEmit` in `scraper/` and confirm zero TypeScript errors
- [x] 6.2 Run a single-URL scrape with `--no-sheets` and confirm the logged JSON output includes `dataSource` populated with the expected source domain
