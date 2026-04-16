## Why

The Bosch scraper and source YAML were created with empty product lists. To run the scraper and collect Bosch product data, the source YAML needs to be populated with the full set of product page URLs across all food type categories.

## What Changes

- Populate `scraper/sources/bosch.yaml` with product URLs for `dry`, `wet`, `treats`, and `misc` categories
- Update `productCounts` in `bosch.yaml` to reflect the total number of URLs added per category

## Capabilities

### New Capabilities

- `bosch-product-url-list`: A complete list of Bosch product page URLs (dry, wet, treats, misc) in the source YAML, enabling the bosch scraper to run and collect product data

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- `scraper/sources/bosch.yaml`: Data-only update — no code changes required
- No app, auth, or Supabase schema changes
- No new EAS build required
