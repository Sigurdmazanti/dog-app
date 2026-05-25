## 1. Source JSON (`scraper/sources/essentialfoods.json`)

- [x] 1.1 Create `scraper/sources/essentialfoods.json` with `scraper`, `brand`, `domain`, empty `products` map (keys: `dry`, `wet`, `treats`, `misc`), `discovery` block with `productLinkSelector` and `listings` for all five listing URLs, and `needsReview` array containing all excluded bundle/accessory URLs
- [x] 1.2 Verify the JSON is valid (parses without error) and all five listing entries have correct `url` and `foodType` values

## 2. Scraper (`scraper/src/scrapers/essentialfoods.ts`)

- [x] 2.1 Create `scraper/src/scrapers/essentialfoods.ts` with a `findAccordionText` helper that locates a `details.accordion` by matching its `summary.accordion__title` text and returns the `.accordion__content` text (empty string if not found)
- [x] 2.2 Implement `scrapeEssentialFoods` using `runScraper` with:
  - `extractTitle`: `h1.heading-size-6.product__title span[data-zoom-caption]` text
  - `extractIngredientsDescription`: text of `.metafield-rich_text_field p` inside the "THE RECIPE" accordion
  - `extractCompositionText`: join nutritional values items (formatted `"<description>: <percentage>"`) from the "NUTRITIONAL VALUES" accordion with the additives free-text from the "ADDITIVES PER KG" accordion, filtering empty strings, joined with `\n`
- [x] 2.3 Verify TypeScript compiles without errors (`cd scraper ; npx tsc --noEmit`)

## 3. Source Registry (`scraper/src/sourceRegistry.ts`)

- [x] 3.1 Add `import { scrapeEssentialFoods } from './scrapers/essentialfoods'` to `sourceRegistry.ts`
- [x] 3.2 Add `{ domain: 'essentialfoods.com', brand: 'Essential Foods', scrape: scrapeEssentialFoods }` entry to the `sourceRegistry` array
- [x] 3.3 Verify `findSource` resolves an `essentialfoods.com` URL to the new entry

## 4. Selector Reference (`scraper/sources/essentialfoods.selectors.md`)

- [x] 4.1 Create `scraper/sources/essentialfoods.selectors.md` documenting: representative HTML snippet, selector table (Field | Selector | Notes), extraction logic as numbered steps, and any gotchas (JS load-more pagination, variable accordion count)
