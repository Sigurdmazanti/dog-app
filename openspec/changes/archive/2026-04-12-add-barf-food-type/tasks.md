## 1. FoodType Enum

- [x] 1.1 Add `Barf = "barf"` to the `FoodType` enum in `scraper/src/interfaces/foodTypes.ts`
- [x] 1.2 Verify TypeScript compiles without errors (`yarn tsc --noEmit` in `scraper/`)

## 2. Water Amount Mapper

- [x] 2.1 Add `[FoodType.Barf]: 0` entry to the `defaultWaterByFoodType` map in `scraper/src/helpers/nutrition/waterAmountMapper.ts`
- [x] 2.2 Verify `getDefaultWaterAmount(FoodType.Barf)` returns `0`

## 3. Source YAML Files

- [x] 3.1 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/acana-eu.yaml`
- [x] 3.2 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/acana-us.yaml`
- [x] 3.3 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/advance.yaml`
- [x] 3.4 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/almo-nature.yaml`
- [x] 3.5 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/amanova.yaml`
- [x] 3.6 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/animonda.yaml`
- [x] 3.7 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/antos.yaml`
- [x] 3.8 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/applaws.yaml`
- [x] 3.9 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/arion.yaml`
- [x] 3.10 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/avlskovgaard.yaml`
- [x] 3.11 Add `barf: 0` under `productCounts` and `barf: []` under `products` in `scraper/sources/zooplus.yaml`

## 4. Scraper CLI Verification

- [x] 4.1 Run `yarn dev -- https://example.com --food-type barf --no-sheets` and confirm `barf` is accepted without a validation error
- [x] 4.2 Run `yarn dev -- https://example.com --food-type invalid` and confirm the error message now lists `barf` among valid food types
