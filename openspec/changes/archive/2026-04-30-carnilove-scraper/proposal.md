## Why

The scraper has no coverage for Carnilove (carnilove.com), a dog food brand offering dry food, wet food, and treats. Adding a scraper expands product data collection to Carnilove and follows the same established scraper pattern used for other sources.

## What Changes

- New scraper file `scraper/src/scrapers/carnilove.ts` extracting product title, ingredients description, and composition text from `carnilove.com` product pages
- New source files `scraper/sources/carnilove.yaml` and `scraper/sources/carnilove.selectors.md`
- New entry in `sourceRegistry.ts` mapping `carnilove.com` to the new scraper

## Capabilities

### New Capabilities

- `carnilove-scraper`: Scrapes product title, ingredients description (composition), and analytical constituents from `carnilove.com` product pages using Cheerio selectors targeting the `h1 .heading__text` title, `tray-component[data-tray-id="tray-ingredients"]` for ingredients, and `tray-component[data-tray-id="tray-nutrition"]` for composition text

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- `scraper/src/scrapers/carnilove.ts` — new file
- `scraper/src/sourceRegistry.ts` — one new import and registry entry
- `scraper/sources/carnilove.yaml` — new source definition with product URLs
- `scraper/sources/carnilove.selectors.md` — new selector reference document
- No schema changes, no app-side changes, no new dependencies
