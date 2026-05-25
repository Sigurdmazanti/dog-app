## 1. Source JSON

- [x] 1.1 Create `scraper/sources/alphaspirit.json` with `scraper: alphaspirit`, `brand: Alpha Spirit`, `domain: alphaspirit.se`, discovery block with `productLinkSelector` and all category listing URLs, and empty `dry`, `wet`, and `treats` product arrays
- [x] 1.2 Verify the JSON is valid and `loadSource` returns an empty array without error for each food type

## 2. Scraper Implementation

- [x] 2.1 Create `scraper/src/scrapers/alphaspirit.ts` exporting `scrapeAlphaSpirit` using `runScraper`
- [x] 2.2 Implement `extractTitle` to return trimmed text of `h1.elementor-heading-title`
- [x] 2.3 Implement `extractIngredientsDescription` by traversing `h3` elements, matching trimmed text `"Sammansättning"`, and returning trimmed text of the following sibling `p`; return empty string if heading not found
- [x] 2.4 Implement `extractCompositionText` by traversing `h3` elements, matching trimmed text `"Analys"`, and returning trimmed text of the following sibling `p`; return empty string if heading not found
- [x] 2.5 Verify the file compiles without TypeScript errors

## 3. Source Registry

- [x] 3.1 Add import for `scrapeAlphaSpirit` from `./scrapers/alphaspirit` in `scraper/src/sourceRegistry.ts`
- [x] 3.2 Add entry `{ domain: 'alphaspirit.se', brand: 'Alpha Spirit', scrape: scrapeAlphaSpirit }` to the registry array
- [x] 3.3 Verify the registry compiles without TypeScript errors

## 4. Selector Reference

- [x] 4.1 Create `scraper/sources/alphaspirit.selectors.md` documenting the homepage URL (`https://alphaspirit.se/`), a representative HTML snippet from a product page, a selectors table covering title (`h1.elementor-heading-title`), ingredients description (h3 "Sammansättning" + next p), and composition text (h3 "Analys" + next p), and any gotchas about Elementor class instability
- [x] 4.2 Verify the selectors reference file covers all three extraction fields

## 5. Smoke Test

- [x] 5.1 Run `npx ts-node src/scraper.ts "<a dry product URL>" --food-type dry --no-sheets` from `scraper/` and confirm title, ingredients description, and composition text are populated in the output
