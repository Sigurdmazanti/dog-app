## 1. Source Files

- [x] 1.1 Create `scraper/sources/applaws.yaml` with `scraper: applaws`, `brand: Applaws`, `domain: applaws.com`, `productCounts`, and `products` sections populated with known product URLs grouped by food type
- [x] 1.2 Create `scraper/sources/applaws.selectors.md` documenting the homepage URL, a representative HTML snippet showing `.f-h5--filson`, `h1.c-detail__title`, and the Composition/Nutrition accordion structure, plus a selectors table and notes

## 2. Scraper Implementation

- [x] 2.1 Create `scraper/src/scrapers/applaws.ts` with a `scrapeApplaws` function using `runScraper`
- [x] 2.2 Implement `extractTitle` to read `.f-h5--filson` text, strip the `Applaws` brand prefix (including ™), strip the bullet-separated pack-size quantity (`• N x Ng`), trim, and append the `h1.c-detail__title` text; fall back to the `h1` alone if `.f-h5--filson` is absent
- [x] 2.3 Implement `extractIngredientsDescription` to find the `<article>` whose button contains the text `Composition` and return the inner text of its `.f-body` element, trimmed
- [x] 2.4 Implement `extractCompositionText` to find the `<article>` whose button contains the text `Nutrition` and return the inner text of its `.f-body` element, trimmed
- [x] 2.5 Verify trademark symbol and pack-size quantity are absent from the composed title for a sample product page

## 3. Source Registry

- [x] 3.1 Import `scrapeApplaws` in `scraper/src/sourceRegistry.ts`
- [x] 3.2 Add `{ domain: 'applaws.com', brand: 'Applaws', scrape: scrapeApplaws }` entry to `sourceRegistry`
- [x] 3.3 Verify `findSource` returns the Applaws entry for an `applaws.com` URL
