## 1. TypeScript Interface

- [x] 1.1 In `scraper/src/interfaces/productComposition.ts`, rename `chlorine: number` → `chloride: number` in the `MineralsData` interface
- [x] 1.2 Verify the TypeScript compiler surfaces all downstream references that now need updating (run `yarn tsc --noEmit` in the `scraper/` directory)

## 2. Composition Key Map

- [x] 2.1 In `scraper/src/helpers/composition/productCompositionKeyMap.ts`, rename the `mineralsKeyMap` key `chlorine` → `chloride` (the alias array value is unchanged)
- [x] 2.2 Verify no TypeScript errors remain in this file

## 3. AI Composition Mapper

- [x] 3.1 In `scraper/src/helpers/composition/aiProductCompositionMapper.ts`, rename the unit-map key `chlorine` → `chloride`
- [x] 3.2 Verify no TypeScript errors remain in this file

## 4. Google Sheets Appender

- [x] 4.1 In `scraper/src/helpers/output/googleSheetsAppender.ts`, rename the schema constant entry `'item_chlorine_mg_per_100g'` → `'item_chloride_mg_per_100g'`
- [x] 4.2 In the same file, rename the column resolver key `item_chlorine_mg_per_100g` → `item_chloride_mg_per_100g`
- [x] 4.3 In the same file, update the resolver value `dataRow.mineralsData.chlorine` → `dataRow.mineralsData.chloride`
- [x] 4.4 Verify no TypeScript errors remain in this file

## 5. Verification

- [x] 5.1 Run `yarn tsc --noEmit` from `scraper/` and confirm zero errors
- [x] 5.2 Search the entire `scraper/src/` directory for any remaining `chlorine` references and confirm none exist (the alias list strings inside `mineralsKeyMap` are expected to remain — confirm those are the only occurrences)
