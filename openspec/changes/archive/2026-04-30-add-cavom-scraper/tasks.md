## 1. Source File

- [x] 1.1 Create `scraper/sources/cavom.json` with `scraper`, `brand`, `domain`, empty `discovery`, and `products.dry` populated with the 10 supplied product URLs

## 2. Scraper Implementation

- [x] 2.1 Create `scraper/src/scrapers/cavom.ts` exporting `scrapeCavom` via `runScraper`
- [x] 2.2 Implement `extractTitle` targeting `h1.entry-title.product_title`, trimmed
- [x] 2.3 Implement a helper that locates the `div.m-productTab` whose `.m-productTab__title h2` equals "Composition" (case-insensitive)
- [x] 2.4 Implement a helper that walks `.m-productTab__text` children and returns the paragraph text following a given `<strong>` heading, stopping at the next heading marker
- [x] 2.5 Implement `extractIngredientsDescription` returning the "Composition" sub-section text
- [x] 2.6 Implement `extractCompositionText` returning "Analytical Constituents" and "Nutritional Additives" joined by newline

## 3. Source Registry

- [x] 3.1 Import `scrapeCavom` in `scraper/src/sourceRegistry.ts`
- [x] 3.2 Add `{ domain: 'cavom.com', brand: 'Cavom', scrape: scrapeCavom }` entry to `sourceRegistry`
- [x] 3.3 Verify `findSource` returns the Cavom entry for a `cavom.com` URL
