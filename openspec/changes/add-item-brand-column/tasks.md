## 1. sourceRegistry.ts — Add brand field

- [x] 1.1 Add `brand: string` to the `SourceEntry` interface
- [x] 1.2 Add a `brand` value to every existing `SourceEntry` object (one per registered scraper source)
- [x] 1.3 Verify TypeScript compiles without errors (`yarn tsc --noEmit` in `scraper/`)

## 2. scrapeResult.ts — Add brand to ScrapeDataRow

- [x] 2.1 Add `brand: string` to the `ScrapeDataRow` interface in `scraper/src/interfaces/scrapeResult.ts`
- [x] 2.2 Verify TypeScript compiles without errors

## 3. scraper.ts — Propagate brand into ScrapeDataRow

- [x] 3.1 In `scrapeUrl`, assign `brand: source.brand` when constructing the `ScrapeDataRow` object
- [x] 3.2 Verify TypeScript compiles without errors

## 4. googleSheetsAppender.ts — Add item_brand column

- [x] 4.1 Add `'item_brand'` to `GOOGLE_SHEETS_SCHEMA` immediately after `'item_name'`
- [x] 4.2 Add a resolver for `item_brand` in `createColumnResolvers` that maps to `toColumnValue(dataRow.brand)`
- [x] 4.3 Verify TypeScript compiles without errors

## 5. End-to-end verification

- [x] 5.1 Run a single-URL dry scrape and confirm `item_brand` appears in console/log output with the expected brand name
