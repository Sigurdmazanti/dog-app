## 1. Source File

- [x] 1.1 Create `scraper/sources/cesar.json` with `scraper: "cesar"`, `brand: "Cesar"`, `domain: "cesar.com"`, empty `discovery`, and `products.wet`, `products.dry`, `products.treats` populated with the supplied URLs (excluding `https://www.cesar.com/recipe-finder`)

## 2. Scraper Implementation

- [x] 2.1 Create `scraper/src/scrapers/cesar.ts` exporting `scrapeCesar` via `runScraper`
- [x] 2.2 Implement `extractTitle` returning the first `<h1>` text, trimmed
- [x] 2.3 Implement `extractIngredientsDescription` returning an empty string (image-based markup)
- [x] 2.4 Implement `extractCompositionText` returning an empty string (image-based markup)

## 3. Source Registry

- [x] 3.1 Import `scrapeCesar` in `scraper/src/sourceRegistry.ts`
- [x] 3.2 Add `{ domain: 'cesar.com', brand: 'Cesar', scrape: scrapeCesar }` entry to `sourceRegistry`
- [x] 3.3 Verify `findSource` returns the Cesar entry for a `cesar.com` URL

## 4. Follow-up (out of scope for this change)

- [ ] 4.1 Confirm with user which suspected duplicate URLs to drop from `products.wet` (simply-crafted / wholesome-bowls vs cesar-* variants)
- [ ] 4.2 Track image-based composition extraction (OCR) as a separate change
