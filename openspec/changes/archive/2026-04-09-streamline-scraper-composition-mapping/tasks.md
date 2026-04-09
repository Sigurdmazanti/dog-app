## 1. Create runScraper helper

- [x] 1.1 Create `scraper/src/helpers/runScraper.ts` and define the `ScraperExtractors` interface with the three typed callback properties
- [x] 1.2 Implement the `runScraper` function: fetch URL with axios, load HTML with cheerio, call all three extractors, call `mapProductCompositionWithAI`, log notes, type-cast all 8 composition sections, and return `ScrapeResult`
- [x] 1.3 Verify `runScraper.ts` compiles with no TypeScript errors (`cd scraper ; npx tsc --noEmit`)

## 2. Refactor scraper/src/scrapers/acana-eu.ts

- [x] 2.1 Replace the function body with a `ScraperExtractors` object containing the existing title, ingredientsDescription, and compositionText extraction logic, then delegate to `runScraper`
- [x] 2.2 Remove the now-redundant imports (NutritionData, MineralsData, etc.) from the file
- [x] 2.3 Verify the file compiles cleanly

## 3. Refactor scraper/src/scrapers/advance.ts

- [x] 3.1 Replace the function body with a `ScraperExtractors` object and delegate to `runScraper`
- [x] 3.2 Remove redundant composition-type imports
- [x] 3.3 Verify the file compiles cleanly

## 4. Refactor scraper/src/scrapers/almo-nature.ts

- [x] 4.1 Replace the function body with a `ScraperExtractors` object and delegate to `runScraper`
- [x] 4.2 Remove redundant composition-type imports
- [x] 4.3 Verify the file compiles cleanly

## 5. Refactor scraper/src/scrapers/amanova.ts

- [x] 5.1 Replace the function body with a `ScraperExtractors` object and delegate to `runScraper`
- [x] 5.2 Remove redundant composition-type imports
- [x] 5.3 Verify the file compiles cleanly

## 6. Refactor scraper/src/scrapers/animonda.ts

- [x] 6.1 Replace the function body with a `ScraperExtractors` object and delegate to `runScraper`
- [x] 6.2 Remove redundant composition-type imports
- [x] 6.3 Verify the file compiles cleanly

## 7. Refactor scraper/src/scrapers/zooplus.ts

- [x] 7.1 Replace the function body with a `ScraperExtractors` object and delegate to `runScraper`
- [x] 7.2 Remove redundant composition-type imports
- [x] 7.3 Verify the file compiles cleanly

## 8. Final verification

- [x] 8.1 Run full TypeScript check across the scraper package (`cd scraper ; npx tsc --noEmit`) — zero errors expected
- [x] 8.2 Confirm all 6 scraper files no longer contain the 8-line composition section destructuring block or the duplicated return statement
