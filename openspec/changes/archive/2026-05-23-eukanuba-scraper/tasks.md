## 1. Source JSON (`scraper/sources/eukanuba.json`)

- [x] 1.1 Create `scraper/sources/eukanuba.json` with `scraper: eukanuba`, `brand: Eukanuba`, `domain: eukanuba.eu`, discovery block (listings + `productLinkSelector: "section.content-container [data-product-item] > a"`), and empty `products` category keys
- [x] 1.2 Populate `products.dry` with all 56 dry food product URLs
- [x] 1.3 Populate `products.wet` with all 18 wet food product URLs
- [x] 1.4 Verify the JSON file parses without error (`node -e "require('./sources/eukanuba.json')"` in scraper dir)

## 2. Scraper (`scraper/src/scrapers/eukanuba.ts`)

- [x] 2.1 Create `scraper/src/scrapers/eukanuba.ts` exporting `scrapeEukanuba` using `runScraper`
- [x] 2.2 Implement `extractTitle` to return text of `h1 span` (trimmed)
- [x] 2.3 Implement `extractIngredientsDescription` to return text of the first `<p>` inside `[data-accordion-content][id="Ingredients"]` (empty string if absent)
- [x] 2.4 Implement `extractCompositionText` to join all `<p>` texts from `[data-accordion-content][id="Ingredients"]` with `\n`, filtering empty values
- [x] 2.5 Verify scraper compiles without TypeScript errors

## 3. Source Registry (`scraper/src/sourceRegistry.ts`)

- [x] 3.1 Import `scrapeEukanuba` from `./scrapers/eukanuba`
- [x] 3.2 Add domain → scraper mapping: `eukanuba.eu` → `scrapeEukanuba` with `brand: "Eukanuba"`
- [x] 3.3 Verify registry compiles without TypeScript errors

## 4. Selector Reference (`scraper/sources/eukanuba.selectors.md`)

- [x] 4.1 Create `scraper/sources/eukanuba.selectors.md` documenting the HTML structure, selector table, and extraction logic for title, ingredients, and composition fields
- [x] 4.2 Include a representative HTML snippet and note on Alpine.js pagination limitation

## 5. Verification

- [x] 5.1 Run scraper against one dry food URL: `npx ts-node src/scraper.ts "https://www.eukanuba.eu/dog/dry-food/special-care-sensitive-skin-adult-all-breed" --food-type dry --no-sheets` and confirm title, ingredients, and composition are extracted correctly
- [x] 5.2 Run scraper against one wet food URL: `npx ts-node src/scraper.ts "https://www.eukanuba.eu/dog/wet-food/adult-rich-in-turkey-with-carrots" --food-type wet --no-sheets` and confirm extraction
