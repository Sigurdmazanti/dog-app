## 1. Scraper module

- [x] 1.1 Create `scraper/src/scrapers/calibra.ts` exporting `scrapeCalibra` using `runScraper`
- [x] 1.2 Implement `extractTitle`: select `h1.product-title` and return its trimmed text
- [x] 1.3 Implement `extractIngredientsDescription`: find the `<details>` whose `summary h3.accordion__title` text equals `"Composition"`, read `div.accordion__content .metafield-rich_text_field` full text, split on `"Analytical constituents:"` (case-insensitive), return the text before the split point with any leading `"Composition: "` prefix stripped and trimmed
- [x] 1.4 Implement `extractCompositionText`: from the same accordion body, return the portion from `"Analytical constituents:"` onwards, trimmed; if the separator is absent return an empty string
- [x] 1.5 Verify: run the scraper against a live `mycalibra.eu` product URL and confirm all three fields are populated correctly

## 2. Source registry

- [x] 2.1 Add `import { scrapeCalibra } from './scrapers/calibra'` to `scraper/src/sourceRegistry.ts`
- [x] 2.2 Add `{ domain: 'mycalibra.eu', brand: 'Calibra', scrape: scrapeCalibra }` to the `sourceRegistry` array
- [x] 2.3 Verify: call `findSource('https://www.mycalibra.eu/products/example')` and confirm it returns the Calibra entry

## 3. Source files

- [x] 3.1 Create `scraper/sources/calibra.yaml` with `scraper: calibra`, `brand: Calibra`, `domain: mycalibra.eu`, `productCounts` (all zeros until URLs are supplied), and an empty `products` map with `dry`, `wet`, `treats`, `freeze-dried`, `misc`, and `barf` keys
- [x] 3.2 Create `scraper/sources/calibra.selectors.md` documenting the homepage URL (`https://www.mycalibra.eu`), a representative HTML snippet (from the "Composition" accordion), and a selectors table covering `h1.product-title`, the accordion title match strategy (`summary h3.accordion__title` text = `"Composition"`), and `div.accordion__content .metafield-rich_text_field`
- [x] 3.3 Verify: `loadSourceUrls('calibra.yaml', 'dry')` returns an empty array without error
