## 1. Scraper implementation (`scraper/src/scrapers/barfworld.ts`)

- [x] 1.1 Create `scraper/src/scrapers/barfworld.ts` with `scrapeBarfworld` function using the `runScraper` helper
- [x] 1.2 Implement `extractTitle` using selector `h1.product-title.title`
- [x] 1.3 Implement `extractIngredientsDescription` using selector `#panel-ingredients .metafield-rich_text_field p` (first paragraph)
- [x] 1.4 Implement `extractCompositionText` joining ingredients description and `"; "`-separated `li` texts from `#panel-guaranteed-analysis .metafield-rich_text_field li`, filtering empty parts, joined with `\n`
- [x] 1.5 Verify TypeScript compiles without errors (`yarn tsc --noEmit` in `scraper/`)

## 2. Source registry (`scraper/src/sourceRegistry.ts`)

- [x] 2.1 Import `scrapeBarfworld` from `./scrapers/barfworld`
- [x] 2.2 Add registry entry `{ domain: 'barfworld.com', brand: 'Barf World', scrape: scrapeBarfworld }` to `sourceRegistry`
- [x] 2.3 Verify TypeScript compiles without errors

## 3. Source definition (`scraper/sources/barfworld.yaml`)

- [x] 3.1 Create `scraper/sources/barfworld.yaml` with `scraper: barfworld`, `brand: Barf World`, `domain: barfworld.com`, zero product counts, and empty product lists for all categories

## 4. Selector reference (`scraper/sources/barfworld.selectors.md`)

- [x] 4.1 Create `scraper/sources/barfworld.selectors.md` documenting the product page HTML structure, with the example markup provided, and the selectors used for title, ingredients, and guaranteed analysis
