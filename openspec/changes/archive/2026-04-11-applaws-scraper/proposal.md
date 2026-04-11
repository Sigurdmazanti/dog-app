## Why

The scraper has no coverage for Applaws (applaws.com), a pet food brand selling wet food, dry food, and treats. Adding a scraper expands product data collection to Applaws and follows the established scraper pattern used for other sources.

## What Changes

- New scraper file `scraper/src/scrapers/applaws.ts` extracting product title, composition, and analytical constituents from `applaws.com` product pages
- Product name is composed by combining the sub-brand/line string from `.f-h5--filson` with the variant title from `h1.c-detail__title`; trademark symbols (™) and size quantities (e.g. `• 16 x 156g`) are stripped
- New source files `scraper/sources/applaws.yaml` and `scraper/sources/applaws.selectors.md`
- New entry in `sourceRegistry.ts` mapping `applaws.com` to the new scraper

## Capabilities

### New Capabilities

- `applaws-scraper`: Scrapes product title (composed from `.f-h5--filson` line + `h1.c-detail__title`, with trademark symbols and gram quantities removed), composition text, and analytical constituents from `applaws.com` product pages using Cheerio selectors

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- `scraper/src/scrapers/applaws.ts` — new file
- `scraper/src/sourceRegistry.ts` — one new import and registry entry
- `scraper/sources/applaws.yaml` — new source definition with product URLs
- `scraper/sources/applaws.selectors.md` — new selector reference document
- No schema changes, no app-side changes, no new dependencies
