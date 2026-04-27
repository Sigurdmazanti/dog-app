## Why

The scraper's `FoodType` enum covers `dry`, `wet`, `treats`, and `freeze-dried`, but some scraped products don't cleanly fit any of these categories (e.g. supplements, toppers, or composite products). A `misc` type provides an escape hatch for ungroupable products without requiring a dedicated category.

## What Changes

- Add `Misc = "misc"` to the `FoodType` enum in `scraper/src/interfaces/`
- Add a `misc` water-amount default (0%) to the water amount mapper
- Enable `misc` as a valid `--food-type` CLI argument in the scraper
- Support `misc:` as a valid product grouping key in source YAML files

## Capabilities

### New Capabilities

- `misc-food-type`: Introduces `misc` as a valid `FoodType` enum value, usable across the scraper CLI, batch scraper, source YAML product groups, and the Google Sheets output column

### Modified Capabilities

- `scraper-source-registry`: The `FoodType` enum now includes `misc` as a valid value — scenarios that enumerate valid food types must include `misc`
- `scraper-cli-simplification`: The `--food-type` CLI argument now accepts `misc` as a valid option

## Impact

- `scraper/src/interfaces/foodTypes.ts` — enum definition
- `scraper/src/helpers/nutrition/waterAmountMapper.ts` — default water % mapping
- `scraper/sources/*.yaml` — any source that has products to group under `misc:`
- Google Sheets output: `item_food_type` column will now accept the value `"misc"`
- No mobile app (React Native) changes required — food types are scraper-only
- No Supabase schema changes required
- No new EAS build needed
