## 1. Scraper Implementation

- [x] 1.1 Create `scraper/src/scrapers/carnilove.ts` with `scrapeCarnilove` function using `runScraper`
- [x] 1.2 Implement `extractTitle` targeting `h1 .heading__text`, trimmed
- [x] 1.3 Implement `extractIngredientsDescription` to extract text from `tray-component[data-tray-id="tray-ingredients"] .tray__content` area
- [x] 1.4 Implement `extractCompositionText` to combine ingredients description with paragraph text from `tray-component[data-tray-id="tray-nutrition"] .tray__content` area, joined by newline
- [x] 1.5 Verify no selectors use `data-astro-cid-*` attributes

## 2. Source Registry

- [x] 2.1 Import `scrapeCarnilove` in `scraper/src/sourceRegistry.ts`
- [x] 2.2 Add `{ domain: 'carnilove.com', brand: 'Carnilove', scrape: scrapeCarnilove }` entry to `sourceRegistry`
- [x] 2.3 Verify `findSource` returns the Carnilove entry for a `carnilove.com` URL

## 3. Source Files

- [x] 3.1 Create `scraper/sources/carnilove.yaml` with `scraper`, `brand`, `domain`, `productCounts`, and `products` sections populated with the provided product URLs
- [x] 3.2 Create `scraper/sources/carnilove.selectors.md` documenting the HTML structure, selectors table, and notes about Astro tray-component layout
