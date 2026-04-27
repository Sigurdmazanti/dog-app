## 1. Source YAML

- [x] 1.1 Create `scraper/sources/canagan.yaml` with `scraper: canagan`, `brand: Canagan`, `domain: canagan.com`
- [x] 1.2 Add `products.dry` list with all 18 dry product URLs
- [x] 1.3 Add `products.wet` list with all 19 wet product URLs
- [x] 1.4 Add `products.treats` list with all 15 treat product URLs
- [x] 1.5 Add `products.toppers` list with 2 freeze-dried topper URLs
- [x] 1.6 Add `productCounts` map with per-category counts and a `total` matching the sum
- [x] 1.7 Verify `productCounts` values match the lengths of each URL list

## 2. Selector Reference

- [x] 2.1 Create `scraper/sources/canagan.selectors.md` with homepage URL and representative HTML snippet showing `h1.product-name` structure and `div.pd-region` sections
- [x] 2.2 Add selectors table covering: product title (second div of `h1.product-name`), composition (`h4` + next `p`), analytical constituents, and nutritional additives

## 3. Scraper Implementation

- [x] 3.1 Create `scraper/src/scrapers/canagan.ts` and export `scrapeCanagan(scrapeRequest: ScrapeRequest): Promise<ScrapeResult>`
- [x] 3.2 Implement `extractTitle` using `$('h1.product-name div').eq(1).text().trim()`
- [x] 3.3 Implement a `findSectionText` helper that iterates `div.pd-region h4` elements and returns the next `<p>` text for a given heading string
- [x] 3.4 Implement `extractIngredientsDescription` returning the `COMPOSITION` section text
- [x] 3.5 Implement `extractCompositionText` combining `ANALYTICAL CONSTITUENTS` and `NUTRITIONAL ADDITIVES (PER KG)` paragraphs (newline-separated, empty strings filtered)
- [x] 3.6 Verify TypeScript compiles without errors (`yarn tsc --noEmit` in `scraper/`)

## 4. Source Registry

- [x] 4.1 Add `import { scrapeCanagan } from './scrapers/canagan'` to `scraper/src/sourceRegistry.ts`
- [x] 4.2 Add `{ domain: 'canagan.com', brand: 'Canagan', scrape: scrapeCanagan }` to the `sourceRegistry` array
- [x] 4.3 Verify `findSource('https://canagan.com/uk/dog-food/dry-dog-food/free-range-chicken-dry-dog-food/')` returns the Canagan entry
