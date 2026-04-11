## 1. Source Files

- [x] 1.1 Create `scraper/sources/avlskovgaard.yaml` with `scraper: avlskovgaard`, `brand: Avlskovgaard`, `domain: avlskovgaard.dk`, and empty product URL lists for `dry`, `wet`, `treats`, and `freeze-dried`
- [x] 1.2 Create `scraper/sources/avlskovgaard.selectors.md` documenting the HTML structure, selectors table (`div.product__title h1`, INGREDIENSER `<h3>` + `next('p')`, `table.nutrition-table tr`), and notes on Danish labels and Shopify page structure

## 2. Scraper Implementation

- [x] 2.1 Create `scraper/src/scrapers/avlskovgaard.ts` exporting `scrapeAvlskovgaard` using `runScraper` with `extractTitle` targeting `div.product__title h1`
- [x] 2.2 Implement `extractIngredientsDescription` in `avlskovgaard.ts`: locate the `<h3>` element inside `.accordion__content.rte` whose text includes "INGREDIENSER", then return the trimmed text of the immediately following `<p>` sibling
- [x] 2.3 Implement `extractCompositionText` in `avlskovgaard.ts`: iterate all `table.nutrition-table tr` body rows, build `Label: value` pairs from the two `<td>` children, join with `; `, then combine ingredients + constituents joined by `\n`

## 3. Source Registry

- [x] 3.1 Add `import { scrapeAvlskovgaard } from './scrapers/avlskovgaard'` to `scraper/src/sourceRegistry.ts`
- [x] 3.2 Add `{ domain: 'avlskovgaard.dk', brand: 'Avlskovgaard', scrape: scrapeAvlskovgaard }` entry to the `sourceRegistry` array
- [x] 3.3 Verify `findSource('https://avlskovgaard.dk/products/torfodder-topping-med-okse')` returns the Avlskovgaard entry
