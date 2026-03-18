## Why

The scraper currently uses a Gross Energy formula to estimate the caloric density of dog food products. Gross Energy does not account for digestibility losses — it overestimates the energy actually available to the animal. Metabolizable Energy (ME) is the scientifically accepted standard for pet food labelling and nutritional comparison, as it reflects energy retained after digestive and urinary losses.

## What Changes

- Replace `calculateGrossEnergy` in `scraper/src/helpers/nutritionCalculator.ts` with a new `calculateMetabolizableEnergy` function using the ME formula
- Rename all call-sites inside the scraper project to use the new function name
- Remove the old `calculateGrossEnergy` export

## Capabilities

### New Capabilities

- `metabolizable-energy-calculation`: Calculates ME (kJ/100g) using the established pet-food formula that accounts for protein, fat, NFE, and fibre with digestibility corrections

### Modified Capabilities

<!-- No existing spec-level requirements are changing — this is an internal scraper implementation detail -->

## Impact

- `scraper/src/helpers/nutritionCalculator.ts` — function replaced and renamed
- `scraper/src/scraper.ts` — import and call-site updated to use new name
- No mobile app code is affected; this change is isolated to the scraper package
- No Supabase schema changes; the output field (`kiloJouleAmount`) retains its name — only its value will be more accurate
- Hot-reload only; no new EAS build required (scraper is a standalone Node package)
