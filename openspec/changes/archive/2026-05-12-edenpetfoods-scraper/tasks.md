## 1. Source JSON (`scraper/sources/edenpetfoods.json`)

- [x] 1.1 Create `scraper/sources/edenpetfoods.json` with `scraper`, `brand`, `domain`, and empty `products` groups for `dry`, `wet`, `treats`, and `misc`
- [x] 1.2 Add `discovery.listings` with all 10 category URLs tagged with the correct food types (dry × 3, wet × 3, treats × 3, misc × 1)
- [x] 1.3 Add `discovery.productLinkSelector: ".products .product figure.product-image > a"`
- [x] 1.4 Add `discovery.pagination` block with `nextSelector: ".pages .pagination .paginate_button.page-item.next"` and `maxPages: 8`
- [x] 1.5 Verify: `loadSource("edenpetfoods.json", "dry")` returns an empty array without error

## 2. Scraper function (`scraper/src/scrapers/edenpetfoods.ts`)

- [x] 2.1 Fetch a representative product page (e.g. a dry-food product) and inspect the rendered HTML to identify selectors for title, ingredients description, and analytical constituents
- [x] 2.2 Create `scraper/src/scrapers/edenpetfoods.ts` exporting `scrapeEdenPetFoods` using `runScraper` with `extractTitle`, `extractIngredientsDescription`, and `extractCompositionText` callbacks
- [x] 2.3 Verify: run `npx ts-node src/scraper.ts "<product-url>" --food-type dry --no-sheets` in `scraper/` and confirm title, ingredients, and composition are populated

## 3. Source registry (`scraper/src/sourceRegistry.ts`)

- [x] 3.1 Add an entry mapping `edenpetfoods.com` → `{ scrapeEdenPetFoods, brand: "Eden Pet Foods" }` in `sourceRegistry.ts`
- [x] 3.2 Verify: `findSource("https://www.edenpetfoods.com/...")` returns the correct entry

## 4. Selector reference (`scraper/sources/edenpetfoods.selectors.md`)

- [x] 4.1 Create `scraper/sources/edenpetfoods.selectors.md` with the homepage URL, a representative HTML snippet, and a selector table covering title, ingredients description, and analytical constituents
- [x] 4.2 Document the duplicate pagination widget behaviour and the first-match resolution in the notes section
