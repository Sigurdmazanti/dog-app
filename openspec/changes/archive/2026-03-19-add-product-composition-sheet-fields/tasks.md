## 1. Composition Interfaces and Contracts

- [x] 1.1 Extend `scraper/src/interfaces/productComposition.ts` with grouped models and fields for all requested minerals, salts, vitamins (including B variants), amino-acid derivatives, vitamin-like compounds, fatty acids, and sugar alcohols using English canonical property names
- [x] 1.2 Update `scraper/src/interfaces/scrapeResult.ts` to include the expanded composition data shape used by downstream exporters
- [x] 1.3 Verification: run TypeScript checks for the scraper package and confirm interface changes compile without contract breaks

## 2. Alias Key Mapping and Source Extraction

- [x] 2.1 Add canonical-first alias map entries in `scraper/src/helpers/productCompositionKeyMap.ts` using first slash value as canonical key and remaining values as aliases
- [x] 2.2 Update `scraper/src/scrapers/zooplus.ts` to populate new composition fields from parsed product composition blocks via the new mappings
- [x] 2.3 Add fallback/default handling in `scraper/src/scraper.ts` so missing expanded fields still produce stable result objects, including explicit `applyNumericFallbacks` calls for each data group
- [ ] 2.4 Verification: scrape representative products and confirm aliases resolve correctly into canonical fields with no duplicate-key output
- [ ] 2.5 Verification: confirm previously supported composition fields remain unchanged in parsed output during representative scraper runs

## 3. Google Sheets Export Wiring

- [x] 3.1 Update `scraper/src/helpers/googleSheetsAppender.ts` to append all expanded composition fields in deterministic column order
- [x] 3.2 Align newly appended values with existing marker comments and add explicit placeholders where a value is unavailable
- [ ] 3.3 Verification: append a row and confirm all new columns are populated/aligned as expected in Google Sheets
- [ ] 3.4 Final verification: run the scraper workflow end-to-end and document any remaining known limitations (for example unit variance)
