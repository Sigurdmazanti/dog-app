## Why

The scraper's `FoodType` enum covers `dry`, `wet`, `treats`, `freeze-dried`, and `misc`, but BARF (Biologically Appropriate Raw Food) is a distinct feeding category that appears across multiple brands and deserves its own type. Grouping it under `misc` loses meaningful categorisation for raw feeding products.

## What Changes

- Add `Barf = "barf"` to the `FoodType` enum in `scraper/src/interfaces/`
- Add a `barf` water-amount default (0%) to the water amount mapper
- Enable `barf` as a valid `--food-type` CLI argument in the scraper
- Add `barf:` as a valid product grouping key in all source YAML files (with `productCounts` entry set to 0 and empty URL list)

## Capabilities

### New Capabilities

- `barf-food-type`: Introduces `barf` as a valid `FoodType` enum value, usable across the scraper CLI, batch scraper, source YAML product groups, and the Google Sheets output column

### Modified Capabilities

- `scraper-source-registry`: The `FoodType` enum now includes `barf` as a valid value — scenarios that enumerate valid food types must include `barf`
- `scraper-cli-simplification`: The `--food-type` CLI argument now accepts `barf` as a valid option

## Impact

- `scraper/src/interfaces/foodTypes.ts` — enum definition
- `scraper/src/helpers/nutrition/waterAmountMapper.ts` — default water % mapping
- `scraper/sources/*.yaml` — all source files get `barf: 0` in `productCounts` and `barf: []` in `products`
- Google Sheets output: `item_food_type` column will now accept the value `"barf"`
- No mobile app (React Native) changes required — food types are scraper-only
- No Supabase schema changes required
- No new EAS build needed
