## Why

The `calibra-scraper` change established the scraper module and source files but left product URLs to be supplied separately. This change populates `calibra.yaml` with the full product URL list. During URL research it was also discovered that the live product catalogue is hosted at `calibrastore.co.uk`, not `mycalibra.eu`, so the domain is corrected throughout at the same time.

## What Changes

- `scraper/sources/calibra.yaml` updated with `domain: calibrastore.co.uk` and all product URLs across `dry` (77 URLs), `wet` (29 URLs), and `treats` (38 URLs de-duplicated), with `productCounts` set accordingly
- `scraper/src/sourceRegistry.ts` domain key changed from `mycalibra.eu` to `calibrastore.co.uk`

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `calibra-scraper`: Domain corrected from `mycalibra.eu` to `calibrastore.co.uk`; `calibra.yaml` now carries the full product URL list and accurate product counts
- `scraper-source-registry`: Domain dispatch key updated from `mycalibra.eu` to `calibrastore.co.uk`

## Impact

- `scraper/sources/calibra.yaml` — data file edit only; no scraper logic changes
- `scraper/src/sourceRegistry.ts` — one-line domain string change
- No Supabase schema changes; no app-layer changes; no new EAS build required
- Scraper selectors remain valid: `calibrastore.co.uk` uses the same Shopify theme and accordion structure as `mycalibra.eu`
