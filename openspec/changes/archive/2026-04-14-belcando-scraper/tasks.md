## 1. Scraper Module (`scraper/src/scrapers/belcando.ts`)

- [x] 1.1 Create `scraper/src/scrapers/belcando.ts` exporting `scrapeBelcando`
- [x] 1.2 Implement `extractTitle` using `h1[itemprop="name"]`
- [x] 1.3 Implement helper to extract a labelled column: iterate `.product-detail-analyse-text .row.mb-3 > .col-md`, match by `strong` text, clone and remove `strong`, return trimmed text
- [x] 1.4 Implement `extractIngredientsDescription` using the "Composition" column helper
- [x] 1.5 Implement `extractCompositionText` — join analytical constituents ("Analytical constituents" column) and additives ("Additives per kg" column) with a newline, prepended by `ingredientsDescription`
- [x] 1.6 Verify the module compiles without TypeScript errors (`yarn tsc --noEmit` in `scraper/`)

## 2. Source Registry (`scraper/src/sourceRegistry.ts`)

- [x] 2.1 Add `import { scrapeBelcando } from './scrapers/belcando'` to `sourceRegistry.ts`
- [x] 2.2 Add `{ domain: 'belcando.com', brand: 'Belcando', scrape: scrapeBelcando }` entry to `sourceRegistry`
- [x] 2.3 Verify `findSource('https://www.belcando.com/...')` returns the Belcando entry (smoke-test manually or via `ts-node`)

## 3. Source YAML (`scraper/sources/belcando.yaml`)

- [x] 3.1 Create `scraper/sources/belcando.yaml` with `scraper: belcando`, `brand: Belcando`, `domain: belcando.com`, and `productCounts` / `products` sections matching the standard structure
- [x] 3.2 Populate `products.dry` with at least one known Belcando product URL (e.g. the "Adult GF Duck" product page)
- [x] 3.3 Verify `loadSourceUrls('belcando.yaml', FoodType.Dry)` returns the populated URL list

## 4. Selector Reference (`scraper/sources/belcando.selectors.md`)

- [x] 4.1 Create `scraper/sources/belcando.selectors.md` with homepage URL (`https://www.belcando.com/`), scraper name, and domain
- [x] 4.2 Add a representative HTML snippet from the provided markup (title `h1`, and the `.product-detail-analyse-text` composition block)
- [x] 4.3 Add a selectors table covering: title, ingredients description column, analytical constituents column, additives column
- [x] 4.4 Add a Notes section documenting the label-matching strategy and any edge cases observed
