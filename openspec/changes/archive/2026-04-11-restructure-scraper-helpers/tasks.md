## 1. Create subdirectories

- [x] 1.1 Create `scraper/src/helpers/parsing/` directory
- [x] 1.2 Create `scraper/src/helpers/nutrition/` directory
- [x] 1.3 Create `scraper/src/helpers/composition/` directory
- [x] 1.4 Create `scraper/src/helpers/output/` directory
- [x] 1.5 Create `scraper/src/helpers/utils/` directory

## 2. Move parsing helpers

- [x] 2.1 `git mv scraper/src/helpers/sitemapParser.ts scraper/src/helpers/parsing/sitemapParser.ts`
- [x] 2.2 `git mv scraper/src/helpers/urlListParser.ts scraper/src/helpers/parsing/urlListParser.ts`
- [x] 2.3 `git mv scraper/src/helpers/percentageStringToInt.ts scraper/src/helpers/parsing/percentageStringToInt.ts`

## 3. Move nutrition helpers

- [x] 3.1 `git mv scraper/src/helpers/nutritionCalculator.ts scraper/src/helpers/nutrition/nutritionCalculator.ts`
- [x] 3.2 `git mv scraper/src/helpers/waterAmountMapper.ts scraper/src/helpers/nutrition/waterAmountMapper.ts`

## 4. Move composition helpers

- [x] 4.1 `git mv scraper/src/helpers/aiProductCompositionMapper.ts scraper/src/helpers/composition/aiProductCompositionMapper.ts`
- [x] 4.2 `git mv scraper/src/helpers/productCompositionKeyMap.ts scraper/src/helpers/composition/productCompositionKeyMap.ts`

## 5. Move output helpers

- [x] 5.1 `git mv scraper/src/helpers/googleSheetsAppender.ts scraper/src/helpers/output/googleSheetsAppender.ts`

## 6. Move utils helpers

- [x] 6.1 `git mv scraper/src/helpers/logger.ts scraper/src/helpers/utils/logger.ts`
- [x] 6.2 `git mv scraper/src/helpers/matchesAlias.ts scraper/src/helpers/utils/matchesAlias.ts`
- [x] 6.3 `git mv scraper/src/helpers/loadSourceUrls.ts scraper/src/helpers/utils/loadSourceUrls.ts`
- [x] 6.4 `git mv scraper/src/helpers/checkMissingFields.ts scraper/src/helpers/utils/checkMissingFields.ts`

## 7. Update cross-imports inside moved helpers

- [x] 7.1 In `helpers/composition/aiProductCompositionMapper.ts`, update `from './logger'` → `from '../utils/logger'`, `from './percentageStringToInt'` → `from '../parsing/percentageStringToInt'`, and `from './productCompositionKeyMap'` → `from './productCompositionKeyMap'` (same folder, no change needed)
- [x] 7.2 In `helpers/output/googleSheetsAppender.ts`, update `from './logger'` → `from '../utils/logger'`
- [x] 7.3 In `helpers/runScraper.ts`, update `from './aiProductCompositionMapper'` → `from './composition/aiProductCompositionMapper'` and `from './logger'` → `from './utils/logger'`

## 8. Update imports in scraper/src/scraper.ts

- [x] 8.1 Update `from './helpers/checkMissingFields'` → `from './helpers/utils/checkMissingFields'`
- [x] 8.2 Update `from './helpers/waterAmountMapper'` → `from './helpers/nutrition/waterAmountMapper'`
- [x] 8.3 Update `from './helpers/nutritionCalculator'` → `from './helpers/nutrition/nutritionCalculator'`
- [x] 8.4 Update `from './helpers/googleSheetsAppender'` → `from './helpers/output/googleSheetsAppender'`
- [x] 8.5 Update `from './helpers/sitemapParser'` → `from './helpers/parsing/sitemapParser'`
- [x] 8.6 Update `from './helpers/urlListParser'` → `from './helpers/parsing/urlListParser'`
- [x] 8.7 Update `from './helpers/loadSourceUrls'` → `from './helpers/utils/loadSourceUrls'`
- [x] 8.8 Update `from './helpers/logger'` → `from './helpers/utils/logger'`

## 9. Update imports in scraper/src/batchScraper.ts

- [x] 9.1 Update `from './helpers/googleSheetsAppender'` → `from './helpers/output/googleSheetsAppender'`
- [x] 9.2 Update `from './helpers/logger'` → `from './helpers/utils/logger'`

## 10. Verify

- [x] 10.1 Run `tsc --noEmit` from `scraper/` and confirm zero errors
- [x] 10.2 Confirm `scraper/src/helpers/` root contains only `runScraper.ts` and the five subdirectories
