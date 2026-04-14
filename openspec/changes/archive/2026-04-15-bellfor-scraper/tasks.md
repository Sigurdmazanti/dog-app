## 1. Scraper Implementation

- [x] 1.1 Create `scraper/src/scrapers/bellfor.ts` exporting `scrapeBellfor` using `runScraper` with `extractTitle` (`h1.product-page-heading`), `extractIngredientsDescription` (second `.tab-pane` `<p>` text), and `extractCompositionText` (flatten both `table.table-margin` elements from the first `.tab-pane` into labelled key-value text lines, combined with ingredients description)
- [x] 1.2 Verify TypeScript compiles without errors for `bellfor.ts`

## 2. Source Registry

- [x] 2.1 Add `import { scrapeBellfor } from './scrapers/bellfor'` to `scraper/src/sourceRegistry.ts`
- [x] 2.2 Add `{ domain: 'bellfor.info', brand: 'Bellfor', scrape: scrapeBellfor }` to the `sourceRegistry` array
- [x] 2.3 Verify `findSource` resolves a `bellfor.info` URL to the Bellfor entry

## 3. Source YAML

- [x] 3.1 Create `scraper/sources/bellfor.yaml` with `scraper: bellfor`, `brand: Bellfor`, `domain: bellfor.info`, a `productCounts` block, and at least one wet product URL under `products.wet`
- [x] 3.2 Populate `products.wet` with individual Bellfor wet food product URLs from `bellfor.info/nassfutter/`
- [x] 3.3 Populate `products.dry` with individual Bellfor dry food product URLs from `bellfor.info/trockenfutter-fuer-hunde/`

## 4. Selector Reference

- [x] 4.1 Create `scraper/sources/bellfor.selectors.md` documenting the homepage URL, a representative HTML snippet showing `h1.product-page-heading` and `.product-tabs-contents .tab-pane` with the analytical tables (`.wrap-table table.table-margin`) and the ingredients `<p>`, and a Selectors table covering Title, Ingredients description, Analytical constituents, and Nutritional additives fields
