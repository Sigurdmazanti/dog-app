## Why

Arion is a Danish pet food brand with a WooCommerce-based product catalogue at `arion-petfood.dk`. Adding a scraper for this source expands the scraper's coverage of European dry dog food brands with detailed nutritional and analytical constituent data.

## What Changes

- Add `arion.yaml` source configuration with `scraper`, `brand`, `domain`, and `products` sections (URLs supplied separately)
- Add `arion.selectors.md` selector reference documenting the WooCommerce page structure and Danish-language field mapping
- Add `arion.ts` scraper implementation registered in `sourceRegistry.ts`

## Capabilities

### New Capabilities

- `arion-scraper`: Scraper for `arion-petfood.dk` product pages — extracts product title, ingredients list (from `#tab-description`), and analytical constituents (from `.nutrition-tab__table` rows)

### Modified Capabilities

- `scraper-source-registry`: Route `arion-petfood.dk` URLs to the new Arion scraper via `findSource`

## Impact

- New files: `scraper/sources/arion.yaml`, `scraper/sources/arion.selectors.md`, `scraper/src/scrapers/arion.ts`
- Modified files: `scraper/src/sourceRegistry.ts` (add Arion entry)
- No auth, Supabase schema, or mobile app changes required
