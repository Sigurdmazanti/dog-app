## Why

Dibo (dibodog.com) is a BARF/raw and fresh-cooked pet food brand with ~50 dog food products not yet covered by the scraper. Adding it expands the product database with a new brand's nutritional and composition data.

## What Changes

- Add a new `dibo` scraper file (`scraper/src/scrapers/dibo.ts`) that extracts title, ingredients description, and composition text from dibodog.com product pages
- Add a new source JSON (`scraper/sources/dibo.json`) with 50 BARF product URLs
- Register `dibodog.com` in the source registry so it routes to the new scraper

## Capabilities

### New Capabilities

- `dibo-scraper`: Scraping behaviour, selector definitions, source JSON, and source registry entry for `dibodog.com` product pages

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- New file: `scraper/src/scrapers/dibo.ts`
- New file: `scraper/sources/dibo.json`
- Modified file: `scraper/src/sourceRegistry.ts` (new domain → scraper mapping)
- No app-side changes; no Supabase schema changes; no EAS build required
