## Why

Calibra is a veterinary and premium pet food brand at `mycalibra.eu` whose products are not yet covered by the scraper. Adding this source expands the nutritional database with Calibra's full product range. Product URLs will be provided separately.

## What Changes

- New scraper module `scraper/src/scrapers/calibra.ts` that extracts title, ingredients description, and composition text from Calibra product pages
- New source files `scraper/sources/calibra.yaml` and `scraper/sources/calibra.selectors.md`
- Source registry updated to dispatch `mycalibra.eu` URLs to the new scraper

## Capabilities

### New Capabilities

- `calibra-scraper`: Scrapes product pages on `mycalibra.eu`, extracting the product title, full ingredients description, and analytical constituents from a Shopify-based accordion layout

### Modified Capabilities

- `scraper-source-registry`: Route `mycalibra.eu` URLs to the new `scrapeCalibra` function

## Impact

- New scraper file added under `scraper/src/scrapers/`
- `scraper/src/helpers/sources/sourceRegistry.ts` (or equivalent) updated with a new entry
- No Supabase schema changes; no app-layer changes; no new EAS build required
