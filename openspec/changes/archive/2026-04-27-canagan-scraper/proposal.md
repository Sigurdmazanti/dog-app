## Why

Canagan is a UK-based premium dog food brand not yet covered by the scraper. Adding support enables nutritional data from their dry, wet, treats, and freeze-dried product ranges to be extracted and processed through the existing pipeline.

## What Changes

- New scraper implementation at `scraper/src/scrapers/canagan.ts`
- New source YAML at `scraper/sources/canagan.yaml` with all 56 product URLs across dry, wet, treats, and freeze-dried categories
- New selector reference at `scraper/sources/canagan.selectors.md`
- Source registry entry routing `canagan.com` URLs to the new scraper

## Capabilities

### New Capabilities

- `canagan-scraper`: Scrape product title, ingredients/composition, and analytical constituents (including additives) from Canagan product pages at `canagan.com`. Product name is extracted only from the second `<div>` inside `h1.product-name`, excluding category/type lines (e.g. "Dry Dog Food", "For Adults").

### Modified Capabilities

- `scraper-source-registry`: Add Canagan URL routing to the source registry dispatch table.

## Impact

- New file: `scraper/src/scrapers/canagan.ts`
- New file: `scraper/sources/canagan.yaml`
- New file: `scraper/sources/canagan.selectors.md`
- Modified: `scraper/src/sources/sourceRegistry.ts` (add `canagan.com` entry)
- No schema changes, no auth changes, no new dependencies
- Hot-reload compatible — no new EAS build required
