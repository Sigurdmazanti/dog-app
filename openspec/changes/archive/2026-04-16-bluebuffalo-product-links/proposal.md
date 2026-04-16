## Why

`scraper/sources/bluebuffalo.yaml` was created as part of the `bluebuffalo-scraper` change but left with all product lists empty. Populating those lists with the full set of known product URLs is required before the scraper can be run against Blue Buffalo.

## What Changes

- `scraper/sources/bluebuffalo.yaml` — populate `products.dry`, `products.wet`, `products.treats`, `products.barf`, and `products.misc` with all known product page URLs
- `productCounts` totals updated to reflect the actual number of entries per category

## Capabilities

### New Capabilities

### Modified Capabilities

- `bluebuffalo-scraper`: Source YAML now contains a full product URL list across all food-type categories (dry, wet, treats, barf, misc), enabling the scraper to be run.

## Impact

- `scraper/sources/bluebuffalo.yaml` — data change only; no code changes required
