## 1. Source JSON (`scraper/sources/dibo.json`)

- [x] 1.1 Create `scraper/sources/dibo.json` with `scraper: "dibo"`, `brand: "Dibo"`, `domain: "dibodog.com"`, empty `discovery` block, and a `barf` array containing all 50 product URLs
- [x] 1.2 Verify the JSON is valid and the `products.barf` array contains exactly 50 entries

## 2. Scraper (`scraper/src/scrapers/dibo.ts`)

- [x] 2.1 Create `scraper/src/scrapers/dibo.ts` exporting a `scrapeDibo` function using `runScraper`
- [x] 2.2 Implement `extractTitle` using `$('h1').first().text().trim()`
- [x] 2.3 Implement `extractIngredientsDescription` to read the first `div.font-serif p` text; fall back to `li` items from the "Dish Composition" `<details>` block if the paragraph is empty
- [x] 2.4 Implement `extractCompositionText` to join `li` items from the "Dish Composition" `<details>` block, then append a blank line and `dt: dd` lines from the "Nutritional Breakdown" `<details>` `dl`
- [x] 2.5 Verify the scraper compiles without TypeScript errors (`npx ts-node --noEmit src/scrapers/dibo.ts` or check via build)

## 3. Source Registry (`scraper/src/sourceRegistry.ts`)

- [x] 3.1 Add a `dibodog.com` → `scrapeDibo` mapping entry in `sourceRegistry.ts`
- [x] 3.2 Verify the registry entry is reachable by running the scraper against one product URL: `npx ts-node src/scraper.ts "https://dibodog.com/products/fresh-menu-beef" --food-type barf --no-sheets`
