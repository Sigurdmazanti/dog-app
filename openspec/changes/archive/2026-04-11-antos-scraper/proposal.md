## Why

The scraper has no coverage for Antos (antos.eu), a pet food brand that sells treats and wet food products. Adding a scraper expands product data collection to Antos and follows the same established scraper pattern used for other sources.

## What Changes

- New scraper file `scraper/src/scrapers/antos.ts` extracting product title, composition, and analytical constituents from `antos.eu` product pages
- New source files `scraper/sources/antos.yaml` and `scraper/sources/antos.selectors.md`
- New entry in `sourceRegistry.ts` mapping `antos.eu` to the new scraper

## Capabilities

### New Capabilities

- `antos-scraper`: Scrapes product title, composition (ingredients text), and analytical constituents from `antos.eu` product pages using Cheerio selectors targeting the `h1[itemprop=name]` title and `div#specs` content block

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- `scraper/src/scrapers/antos.ts` — new file
- `scraper/src/sourceRegistry.ts` — one new import and registry entry
- `scraper/sources/antos.yaml` — new source definition with product URLs
- `scraper/sources/antos.selectors.md` — new selector reference document
- No schema changes, no app-side changes, no new dependencies
