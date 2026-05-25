## Why

Essential Foods products are not yet covered by the scraper, leaving a gap in the dog nutrition database. Adding this brand expands product coverage with high-quality grain-free dry and wet food data.

## What Changes

- New scraper file `scraper/src/scrapers/essentialfoods.ts` targeting `essentialfoods.com` (Shopify-based theme with collapsible accordion product data panels)
- New source JSON `scraper/sources/essentialfoods.json` with `dry`, `wet`, `treats`, and `misc` product groups and discovery config
- New selector reference `scraper/sources/essentialfoods.selectors.md`
- Source registry entry mapping `essentialfoods.com` to the new scraper

## Capabilities

### New Capabilities

- `essentialfoods-scraper`: Scraper for Essential Foods product pages on `essentialfoods.com`. Extracts title, recipe/ingredients, nutritional values, and additives from collapsible accordion sections. Discovery configured for listing pages across dry, wet, treats, and misc food types with a JS load-more pagination pattern.

### Modified Capabilities

- `scraper-source-registry`: New domain→scraper mapping entry added for `essentialfoods.com`.

## Impact

- `scraper/src/sourceRegistry.ts`: one new import and registry entry
- `scraper/src/scrapers/essentialfoods.ts`: new file
- `scraper/sources/essentialfoods.json`: new file
- `scraper/sources/essentialfoods.selectors.md`: new file
- No changes to shared helpers, interfaces, or the React Native app
