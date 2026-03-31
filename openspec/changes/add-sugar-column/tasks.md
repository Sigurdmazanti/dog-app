## 1. Data Model (productComposition.ts)

- [x] 1.1 Add `sugar: number` field to `NutritionData` interface in `scraper/src/interfaces/productComposition.ts`
- [x] 1.2 Verify the scraper compiles with `npx tsc --noEmit` from the scraper directory

## 2. Key Map (productCompositionKeyMap.ts)

- [x] 2.1 Add `sugar` entry to `nutritionKeyMap` in `scraper/src/helpers/productCompositionKeyMap.ts` with aliases: `['sugar', 'sukker', 'sugars', 'sukkerarter', 'total sugar', 'total sukker']`
- [x] 2.2 Verify the scraper compiles with `npx tsc --noEmit`

## 3. AI Composition Mapper (aiProductCompositionMapper.ts)

- [x] 3.1 Add `sugar: 'g/100g'` entry to `CANONICAL_FIELD_UNITS` in `scraper/src/helpers/aiProductCompositionMapper.ts` under the `// nutritionData` section
- [x] 3.2 Verify the schema template auto-generates the sugar field from the key map (no extra work needed — `createCanonicalSchemaTemplate` iterates `SECTION_KEY_MAPS`)
- [x] 3.3 Verify the scraper compiles with `npx tsc --noEmit`

## 4. Google Sheets Appender (googleSheetsAppender.ts)

- [x] 4.1 Add `'item_sugar_g_per_100g'` to `GOOGLE_SHEETS_SCHEMA` array after `'item_water_g_per_100g'` in `scraper/src/helpers/googleSheetsAppender.ts`
- [x] 4.2 Add `item_sugar_g_per_100g: toColumnValue(dataRow.nutritionData.sugar)` to the `createColumnResolvers` return object
- [x] 4.3 Verify the scraper compiles with `npx tsc --noEmit`

## 5. End-to-End Verification

- [x] 5.1 Run `npx tsc --noEmit` from the scraper directory to confirm full type safety across all changed files
