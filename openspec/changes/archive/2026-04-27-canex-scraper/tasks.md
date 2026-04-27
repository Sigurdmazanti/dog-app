## 1. Source YAML & Selector Reference

- [x] 1.1 Create `scraper/sources/canex.yaml` with brand "Canex", domain "canex-shop.dk", 20 dry URLs, 24 treat URLs, and correct product counts (dry: 20, treats: 24, total: 44)
- [x] 1.2 Create `scraper/sources/canex.selectors.md` documenting CSS selectors: `h1.product-title` for title, `.product-short-description` for short description fallback, accordion `#accordion-*-content` for composition section, and `table` rows for analytical values

## 2. Scraper Implementation

- [x] 2.1 Create `scraper/src/scrapers/canex.ts` with `scrapeCanex` function using `runScraper` pattern
- [x] 2.2 Implement `extractTitle` using `$('h1.product-title')` selector
- [x] 2.3 Implement `extractIngredientsDescription` to extract ingredient text from the "Sammensætning" accordion paragraph content, falling back to `.product-short-description` for treats
- [x] 2.4 Implement `extractCompositionText` to extract analytical table rows as "label: value" pairs from the accordion table, falling back to inline "Analyse:" text in short descriptions, and combine with ingredients description

## 3. Source Registry

- [x] 3.1 Add `import { scrapeCanex } from './scrapers/canex'` to `scraper/src/sourceRegistry.ts`
- [x] 3.2 Add `{ domain: 'canex-shop.dk', brand: 'Canex', scrape: scrapeCanex }` entry to the `sourceRegistry` array

## 4. AI Mapper Translation Support

- [x] 4.1 Extend `createPrompt` in `scraper/src/helpers/composition/aiProductCompositionMapper.ts` to add an instruction for the model to return an `ingredientsDescriptionEnglish` field with the English translation of the ingredient list (or `null` if not identifiable)
- [x] 4.2 Update the AI mapper response parsing to extract the optional `ingredientsDescriptionEnglish` field from the JSON response
- [x] 4.3 Update `runScraper` in `scraper/src/helpers/runScraper.ts` to use `ingredientsDescriptionEnglish` from the AI response when present, falling back to the raw `ingredientsDescription`

## 5. Verification

- [x] 5.1 Test the scraper on a single dry food product URL: `npx ts-node src/scraper.ts "https://canex-shop.dk/produkter/puppy-junior-brocks-12-kg/" --food-type dry --no-sheets`
- [x] 5.2 Test the scraper on a single treat product URL: `npx ts-node src/scraper.ts "https://canex-shop.dk/produkter/canex-maxi-bones-500-g/" --food-type treats --no-sheets`
- [x] 5.3 Verify the `ingredientsDescription` in the output is in English (translated from Danish)
