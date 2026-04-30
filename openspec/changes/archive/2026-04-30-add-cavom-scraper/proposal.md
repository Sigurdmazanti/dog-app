## Why

The scraper has no coverage for Cavom (cavom.com), a Dutch dog food brand offering complete dry diets. Adding a scraper expands product data collection to Cavom and follows the same established scraper pattern used for other sources.

## What Changes

- New scraper file `scraper/src/scrapers/cavom.ts` extracting product title, ingredients description, and composition text from `cavom.com` product pages
- New source file `scraper/sources/cavom.json` with the provided dry product URLs
- New entry in `sourceRegistry.ts` mapping `cavom.com` to the new scraper

## Capabilities

### New Capabilities

- `cavom-scraper`: Scrapes product title, ingredients description, and analytical/additive composition text from `cavom.com` product pages using Cheerio selectors targeting the `h1.entry-title.product_title` title and the `Composition` tab inside `div.m-productTab` (segmented by `<strong>` headings into Composition, Analytical Constituents, and Nutritional Additives sections)

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- `scraper/src/scrapers/cavom.ts` — new file
- `scraper/src/sourceRegistry.ts` — one new import and registry entry
- `scraper/sources/cavom.json` — new source definition with product URLs
- No schema changes, no app-side changes, no new dependencies
