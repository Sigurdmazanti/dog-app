## 1. Scraper Implementation

- [x] 1.1 Create `scraper/src/scrapers/antos.ts` with `scrapeAntos` function using `runScraper`, targeting `h1[itemprop="name"]` for title
- [x] 1.2 Implement `extractIngredientsDescription` to collect text nodes from `div#specs` contents before the `Analytical Constituents` `<strong>` header
- [x] 1.3 Implement `extractCompositionText` to iterate `div#specs table tr` rows and format each row as `Label: value`, joined by `; `
- [x] 1.4 Verify promotional `<a>` tag text is excluded from both extracted fields

## 2. Source Registry

- [x] 2.1 Import `scrapeAntos` in `scraper/src/sourceRegistry.ts`
- [x] 2.2 Add `{ domain: 'antos.eu', brand: 'Antos', scrape: scrapeAntos }` entry to `sourceRegistry`
- [x] 2.3 Verify `findSource` returns the Antos entry for an `antos.eu` URL

## 3. Source Files

- [x] 3.1 Create `scraper/sources/antos.yaml` with `scraper`, `brand`, `domain`, `productCounts`, and `products` sections (populate with known product URLs)
- [x] 3.2 Create `scraper/sources/antos.selectors.md` documenting the HTML structure, selectors table, and any notes about the `div#specs` layout
