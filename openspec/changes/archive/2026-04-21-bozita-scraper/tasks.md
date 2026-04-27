## 1. Scraper module (`scraper/src/scrapers/bozita.ts`)

- [x] 1.1 Create `scraper/src/scrapers/bozita.ts` exporting `scrapeBozita`
- [x] 1.2 Implement `extractTitle` using `$('h1.headline').first().text().trim()`
- [x] 1.3 Implement helper to locate the `p` sibling following a named `h5` inside `div.product-detail` by matching trimmed heading text
- [x] 1.4 Implement `extractIngredientsDescription` to return the text of the `p` following `h5` "COMPOSITION"; return empty string when missing
- [x] 1.5 Implement `extractCompositionText` to return the text of the `p` following `h5` "ANALYTICAL CONSTITUENTS", with the `p` following `h5` "ADDITIVES (PER KG)" appended (newline-separated) when present; filter empty strings before joining
- [x] 1.6 Verify: run `yarn scrape bozita https://bozita.com/dog-food/robur-sensitive-small-with-lamb/` (or equivalent CLI command) and confirm title, ingredients, and analytical constituents are extracted correctly

## 2. Source registry (`scraper/src/sourceRegistry.ts`)

- [x] 2.1 Import `scrapeBozita` from `./scrapers/bozita`
- [x] 2.2 Add `{ domain: 'bozita.com', brand: 'Bozita', scrape: scrapeBozita }` entry to `sourceRegistry`
- [x] 2.3 Verify: `findSource('https://bozita.com/dog-food/robur-sensitive-small-with-lamb/')` returns the Bozita entry

## 3. Source YAML (`scraper/sources/bozita.yaml`)

- [x] 3.1 Create `scraper/sources/bozita.yaml` with `scraper: bozita`, `brand: Bozita`, `domain: bozita.com`
- [x] 3.2 Add `productCounts` map: `dry: 30`, `wet: 22`, `treats: 5`, `total: 57`
- [x] 3.3 Populate `products.dry` with all 30 dry product URLs
- [x] 3.4 Populate `products.wet` with all 22 wet product URLs
- [x] 3.5 Populate `products.treats` with all 5 treat product URLs
- [x] 3.6 Verify: confirm `productCounts` values match actual list lengths in the file

## 4. Selector reference (`scraper/sources/bozita.selectors.md`)

- [x] 4.1 Create `scraper/sources/bozita.selectors.md` with homepage URL `https://bozita.com`, representative HTML example from the product page, and a selectors table covering title (`h1.headline`), composition (`h5` "COMPOSITION" + next `p`), additives (`h5` "ADDITIVES (PER KG)" + next `p`), and analytical constituents (`h5` "ANALYTICAL CONSTITUENTS" + next `p`)
- [x] 4.2 Verify: file contains all four rows in the selectors table
