## 1. Advance Scraper

- [x] 1.1 Create `scraper/src/scrapers/advance.ts` exporting `scrapeAdvance(scrapeRequest: ScrapeRequest): Promise<ScrapeResult>` — extract title from `.product-title`, ingredients from `.ings-content .metafield-rich_text_field`, nutritional table rows from `.nutritional-table table tr`, delegate all text to `mapProductCompositionWithAI()`
- [x] 1.2 Verify `advance.ts` compiles with `npx tsc --noEmit`

## 2. Almo Nature Scraper

- [x] 2.1 Create `scraper/src/scrapers/almo-nature.ts` exporting `scrapeAlmoNature(scrapeRequest: ScrapeRequest): Promise<ScrapeResult>` — extract title from `.product-category` + `.product-flavor`, ingredients from `#composition`, analytical constituents from `#constituents ul`, additives from `.Product__additives`, delegate all text to `mapProductCompositionWithAI()`
- [x] 2.2 Verify `almo-nature.ts` compiles with `npx tsc --noEmit`

## 3. Amanova Scraper

- [x] 3.1 Create `scraper/src/scrapers/amanova.ts` exporting `scrapeAmanova(scrapeRequest: ScrapeRequest): Promise<ScrapeResult>` — extract title from `#title-product` + `.product__text`, ingredients from the Ingredients accordion `.accordion__content .metafield-rich_text_field`, components from the Components accordion `.accordion__content .metafield-multi_line_text_field`, delegate all text to `mapProductCompositionWithAI()`
- [x] 3.2 Verify `amanova.ts` compiles with `npx tsc --noEmit`

## 4. Animonda Scraper

- [x] 4.1 Create `scraper/src/scrapers/animonda.ts` exporting `scrapeAnimonda(scrapeRequest: ScrapeRequest): Promise<ScrapeResult>` — extract title from `.product-detail-title`, composition/ingredients from `.product-detail-composition__main-content`, analytical constituents from `.product-detail-ingredients__list-item` spans, nutritional additives from `.product-detail-nutritional-additives__list li`, delegate all text to `mapProductCompositionWithAI()`
- [x] 4.2 Verify `animonda.ts` compiles with `npx tsc --noEmit`

## 5. URL Dispatch Update

- [x] 5.1 Add imports for all four new scrapers in `scraper/src/scraper.ts`
- [x] 5.2 Rewrite the URL dispatch block in `scrapeUrl()` to a proper `if`/`else if` chain covering `zooplus`, `emea.acana`, `advancepet.com`, `almonature.com`, `amanova`, `animonda`, with a final `else throw`
- [x] 5.3 Verify `scraper.ts` compiles with `npx tsc --noEmit`
