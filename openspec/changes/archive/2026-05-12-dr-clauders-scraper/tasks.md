## 1. Source JSON

- [x] 1.1 Create `scraper/sources/dr-clauders.json` with `scraper: dr-clauders`, `brand: Dr. Clauder's`, `domain: dr-clauder.com`, discovery config (listings for all four food types, `productLinkSelector`, `pagination` with `nextSelector` and `maxPages: 8`), and empty product buckets for `dry`, `wet`, `treats`, and `misc`

## 2. Scraper Module

- [x] 2.1 Create `scraper/src/scrapers/dr-clauders.ts` implementing `scrapeDrClauders` using `runScraper` with `extractTitle` targeting `h1.product-detail__title` and both `extractIngredientsDescription` and `extractCompositionText` reading `#composition-content`

## 3. Source Registry

- [x] 3.1 Add a `dr-clauder.com` → `scrapeDrClauders` entry in `scraper/src/sourceRegistry.ts`

## 4. Selector Reference

- [x] 4.1 Create `scraper/sources/dr-clauders.selectors.md` documenting the homepage URL, a representative HTML snippet from a product page, and a selector table covering title and composition content extraction
