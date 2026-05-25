## Why

Eukanuba is a major international dog food brand with a large product catalogue on `eukanuba.eu`. Adding a scraper enables their products to be included in the app's nutrition database alongside other supported brands.

## What Changes

- New scraper file `scraper/src/scrapers/eukanuba.ts` implementing the `scrapeEukanuba` function using `runScraper`
- New source JSON `scraper/sources/eukanuba.json` with brand metadata, discovery configuration (listing URLs + pagination/load-more selector), and populated `dry` and `wet` product URL lists
- Source registry entry mapping `eukanuba.eu` → `scrapeEukanuba`
- New selector reference `scraper/sources/eukanuba.selectors.md` documenting HTML structure and extraction logic

## Capabilities

### New Capabilities

- `eukanuba-scraper`: Scrapes product title, ingredients description, and composition text from Eukanuba product pages on `eukanuba.eu`. Covers dry and wet food product types. Includes discovery configuration for automated listing traversal with load-more pagination (Alpine.js `x-show`/`@click` pattern).

### Modified Capabilities

<!-- No existing capability requirements are changing -->

## Impact

- `scraper/src/sourceRegistry.ts` gains a new domain → scraper mapping
- No app-side (React Native) changes required
- No new npm dependencies needed
- No Supabase schema changes
