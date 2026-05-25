## 1. Source JSON (`scraper/sources/edgard-cooper.json`)

- [x] 1.1 Create `scraper/sources/edgard-cooper.json` with `scraper`, `brand`, `domain`, `discovery` (listings + `productLinkSelector`), and `products` (dry, wet, treats, misc) populated with the supplied URLs

## 2. Scraper Module (`scraper/src/scrapers/edgard-cooper.ts`)

- [x] 2.1 Create `scraper/src/scrapers/edgard-cooper.ts` exporting `scrapeEdgardCooper`
- [x] 2.2 Implement `extractTitle` using `h1.font-imperfect`
- [x] 2.3 Implement `extractIngredientsDescription` by finding the `<button>` whose text starts with `"Composition"` and reading the text of its adjacent disclosure panel
- [x] 2.4 Implement `extractCompositionText` by finding the `<button>` whose text starts with `"Nutritional Info"` and reading the text of its adjacent disclosure panel; join with ingredients description via `\n`

## 3. Source Registry (`scraper/src/sourceRegistry.ts`)

- [x] 3.1 Import `scrapeEdgardCooper` from `./scrapers/edgard-cooper`
- [x] 3.2 Add `{ domain: 'edgardcooper.com', brand: 'Edgard & Cooper', scrape: scrapeEdgardCooper }` to `sourceRegistry`

## 4. Selector Reference (`scraper/sources/edgard-cooper.selectors.md`)

- [x] 4.1 Create `scraper/sources/edgard-cooper.selectors.md` documenting the representative HTML snippet, selector table (Title / Composition panel / Nutritional Info panel / Product link), extraction logic, and any gotchas

## 5. Verification

- [x] 5.1 Test a dry product: `npx ts-node src/scraper.ts "https://www.edgardcooper.com/en/products/dog-dry-food-chicken/" --food-type dry --no-sheets`
- [x] 5.2 Test a wet product: `npx ts-node src/scraper.ts "https://www.edgardcooper.com/en/products/dog-tin-chicken-turkey/" --food-type wet --no-sheets`
- [x] 5.3 Test a treats product: `npx ts-node src/scraper.ts "https://www.edgardcooper.com/en/products/dog-bites-chicken/" --food-type treats --no-sheets`
- [x] 5.4 Test a misc product: `npx ts-node src/scraper.ts "https://www.edgardcooper.com/en/products/doggy-dental-mint-strawberry/" --food-type misc --no-sheets`
- [x] 5.5 Confirm title, ingredients description, and composition text are all non-empty for each food type test
