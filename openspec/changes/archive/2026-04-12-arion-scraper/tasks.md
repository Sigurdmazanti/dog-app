## 1. Source Files

- [x] 1.1 Create `scraper/sources/arion.yaml` with `scraper: arion`, `brand: Arion`, `domain: arion-petfood.dk`, and empty product URL lists for `dry`, `wet`, `treats`, and `freeze-dried`
- [x] 1.2 Create `scraper/sources/arion.selectors.md` documenting the HTML structure, selectors table (`h1.entry-title.product_title`, `.nutrition-tab__table .nutrition-tab__table__row`, `#tab-description`), and notes on Danish labels and `.extra-rows`

## 2. Scraper Implementation

- [x] 2.1 Create `scraper/src/scrapers/arion.ts` exporting `scrapeArion` using `runScraper` with `extractTitle` targeting `h1.entry-title.product_title`
- [x] 2.2 Implement `extractIngredientsDescription` in `arion.ts`: locate the `<b>` element in `#tab-description` whose text is `Ingredienser:`, collect `<li>` text from the following `<ul>`, join with `, `
- [x] 2.3 Implement `extractCompositionText` in `arion.ts`: iterate all `.nutrition-tab__table .nutrition-tab__table__row` elements, build `Label: value` pairs from the two `<span>` children, join with `; `, then combine ingredients + constituents joined by `\n`

## 3. Source Registry

- [x] 3.1 Add `import { scrapeArion } from './scrapers/arion'` to `scraper/src/sourceRegistry.ts`
- [x] 3.2 Add `{ domain: 'arion-petfood.dk', brand: 'Arion', scrape: scrapeArion }` entry to the `sourceRegistry` array
- [x] 3.3 Verify `findSource('https://arion-petfood.dk/produkt/adult-grain-free-chicken-potato/')` returns the Arion entry
