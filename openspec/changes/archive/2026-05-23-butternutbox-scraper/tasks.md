## 1. Source JSON

- [x] 1.1 Create `scraper/sources/butternutbox.json` with `scraper`, `brand`, `domain`, `discovery` (empty), and `products` sections containing all wet, treats, and misc URLs provided
- [x] 1.2 Verify JSON is valid and all 32 product URLs are present under the correct category keys

## 2. Scraper Implementation

- [x] 2.1 Create `scraper/src/scrapers/butternutbox.ts` implementing `scrapeButternutbox` using `runScraper`
- [x] 2.2 Implement `extractTitle` using `$('[data-testid="title"]').text().trim()`
- [x] 2.3 Implement `extractIngredientsDescription` by iterating accordion buttons, matching the "Ingredients" label, and returning the text of its `[data-testid="rich-text"]` container
- [x] 2.4 Implement `extractCompositionText` by iterating accordion buttons, matching the "Nutritional info" label, and concatenating its `[data-testid="rich-text"]` text with `ingredientsDescription`

## 3. Source Registry

- [x] 3.1 Add import for `scrapeButternutbox` from `./scrapers/butternutbox` in `scraper/src/sourceRegistry.ts`
- [x] 3.2 Add registry entry `{ domain: 'butternutbox.com', brand: 'Butternutbox', scrape: scrapeButternutbox }` to the `sourceRegistry` array

## 4. Selector Reference

- [x] 4.1 Create `scraper/sources/butternutbox.selectors.md` documenting the MUI Accordion HTML structure, selector table, and extraction logic

## 5. Verification

- [x] 5.1 Run `npx ts-node src/scraper.ts "https://butternutbox.com/our-dog-food/fresh-meals/beef" --food-type wet --no-sheets` from the `scraper/` directory and confirm title, ingredients, and composition text are extracted correctly
- [x] 5.2 Run a treat URL (e.g., `training-treats-chicken`) with `--food-type treats` and confirm extraction works
- [x] 5.3 Run a misc URL (e.g., `supplements/fish-oil`) with `--food-type misc` and confirm extraction works or returns gracefully if data is absent
