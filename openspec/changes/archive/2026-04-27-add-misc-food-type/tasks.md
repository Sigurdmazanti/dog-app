## 1. FoodType Enum

- [x] 1.1 Add `Misc = "misc"` to the `FoodType` enum in `scraper/src/interfaces/foodTypes.ts`
- [x] 1.2 Verify TypeScript compiles without errors (`yarn tsc --noEmit` in `scraper/`)

## 2. Water Amount Mapper

- [x] 2.1 Add `[FoodType.Misc]: 0` entry to the `defaultWaterByFoodType` map in `scraper/src/helpers/nutrition/waterAmountMapper.ts`
- [x] 2.2 Verify `waterAmountMapper` returns `0` when called with `FoodType.Misc`

## 3. Scraper CLI Verification

- [x] 3.1 Run `yarn dev -- https://example.com --food-type misc --no-sheets` (or equivalent dry-run) and confirm `misc` is accepted without a validation error
- [x] 3.2 Run `yarn dev -- https://example.com --food-type invalid` and confirm the error message now lists `misc` among valid food types

## 4. Source YAML (optional, as-needed)

- [x] 4.1 For any source brand that has products fitting the `misc` category, add a `misc:` key under `products:` in `scraper/sources/<brand>.yaml` with the appropriate URLs
