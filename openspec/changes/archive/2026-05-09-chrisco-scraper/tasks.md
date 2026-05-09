## 1. Source JSON

- [x] 1.1 Create `scraper/sources/chrisco.json` with `scraper: chrisco`, `brand: Chrisco`, `domain: chrisco.dk`, and product URL lists for `dry`, `wet`, and `treats`
- [x] 1.2 Verify `chrisco.json` loads without error via `loadSource`

## 2. Selector Reference

- [x] 2.1 Create `scraper/sources/chrisco.selectors.md` documenting the homepage URL, representative HTML snippet, and selectors table for title, composition, and analytical components extraction

## 3. Scraper Implementation

- [x] 3.1 Create `scraper/src/scrapers/chrisco.ts` with `scrapeChrisco` function using `runScraper`
- [x] 3.2 Implement `extractTitle` extracting trimmed text from `h1.page-title`
- [x] 3.3 Implement `findTabPanelIdByHref` helper that locates an `a.data.switch` by label text and returns the panel ID from its `href` attribute
- [x] 3.4 Implement `extractIngredientsDescription` using `findTabPanelIdByHref` with label `"Næringsindhold"` and returning the panel's trimmed text (empty string if absent)
- [x] 3.5 Implement `extractCompositionText` returning the same `"Næringsindhold"` panel text (empty string if absent)

## 4. Source Registry

- [x] 4.1 Add `chrisco.dk` → `scrapeChrisco` mapping in `scraper/src/sourceRegistry.ts`
- [x] 4.2 Verify a `chrisco.dk` URL resolves to the correct scraper via `findSource`

## 5. Verification

- [x] 5.1 Run `npx ts-node src/scraper.ts "https://www.chrisco.dk/hundeprodukter/hundefoder/torfoder/paw-knas-7-kg" --food-type dry --no-sheets` and confirm title, ingredients description, and composition text are extracted correctly
