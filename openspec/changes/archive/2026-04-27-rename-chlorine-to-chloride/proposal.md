## Why

The mineral "chloride" has been incorrectly named "chlorine" throughout the scraper codebase. Chlorine (Cl₂) is a gas, while chloride (Cl⁻) is the ionic form measured in pet food composition — using "chloride" is scientifically accurate and aligns with the Google Sheets schema rename to `item_chloride_mg_per_100g`.

## What Changes

- Rename `chlorine` → `chloride` in the `MineralsData` TypeScript interface
- Rename the key `chlorine` → `chloride` in `mineralsKeyMap` (key name only; the alias list already contains both terms and is unchanged)
- Rename `chlorine` → `chloride` in `aiProductCompositionMapper` unit map
- Rename the Google Sheets column `item_chlorine_mg_per_100g` → `item_chloride_mg_per_100g` in the schema constant and column resolver in `googleSheetsAppender.ts`
- Update all references to `dataRow.mineralsData.chlorine` → `dataRow.mineralsData.chloride`

## Capabilities

### New Capabilities
<!-- None introduced -->

### Modified Capabilities
- `google-sheets-column-schema-alignment`: The `item_chlorine_mg_per_100g` column is renamed to `item_chloride_mg_per_100g` in the canonical export schema.

## Impact

- **`scraper/src/interfaces/productComposition.ts`** — `MineralsData.chlorine` field rename (TypeScript breaking change; all consumers must be updated)
- **`scraper/src/helpers/composition/productCompositionKeyMap.ts`** — `mineralsKeyMap` key rename
- **`scraper/src/helpers/composition/aiProductCompositionMapper.ts`** — unit map key rename
- **`scraper/src/helpers/output/googleSheetsAppender.ts`** — schema constant and column resolver rename
- No scraper source YAML files reference `chlorine` directly; the alias list in `mineralsKeyMap` continues to match both "chlorine" and "chloride" labels found on product pages
- No new EAS build required; scraper-only change
