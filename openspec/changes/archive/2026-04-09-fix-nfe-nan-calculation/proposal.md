## Why

`calculateNFE` computes `100 - water - protein - fat - fiber - crudeAsh`, but any of these fields can be `undefined` on a scraped product. When that happens, the subtraction yields `NaN`, causing notes like _"Ingen NFE-værdi. Udregnet til NaN%"_ to appear in every exported row.

## What Changes

- `calculateNFE` will treat any missing nutrition component as `0` before performing the subtraction, preventing `NaN` results.
- `calculateMetabolizableEnergy` is safe by extension because it calls `calculateNFE` internally; undefined fields will also be guarded there.

## Capabilities

### New Capabilities

- `nfe-calculation`: Requirements for the `calculateNFE` helper — inputs, undefined-field handling, and expected output range.

### Modified Capabilities

- `metabolizable-energy-calculation`: Update to document that NFE (and thus ME) gracefully handles missing nutrition fields rather than propagating `NaN`.

## Impact

- `scraper/src/helpers/nutritionCalculator.ts` — both `calculateNFE` and `calculateMetabolizableEnergy` touch undefined values indirectly.
- Note text in scraped output rows will show a real numeric value instead of `NaN%`.
- No schema changes, no new dependencies, no EAS build required.
