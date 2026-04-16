## Why

`bosch-tiernahrung.de` is a supported dog food brand not yet covered by the scraper. Adding it extends nutritional data coverage to Bosch products, with product URLs to be supplied separately.

## What Changes

- New scraper function `scrapeBosch` for `bosch-tiernahrung.de` product pages
- New source registry entry routing `bosch-tiernahrung.de` URLs to `scrapeBosch`
- New source YAML at `scraper/sources/bosch.yaml` (URL list to be populated separately)
- New selector reference at `scraper/sources/bosch.selectors.md`

## Capabilities

### New Capabilities

- `bosch-scraper`: Scrapes product title, composition (ingredients), and analytical constituents from `bosch-tiernahrung.de` product pages using tab-panel navigation via `aria-controls` attributes

### Modified Capabilities

_(none)_

## Impact

- New file: `scraper/src/scrapers/bosch.ts`
- New file: `scraper/sources/bosch.yaml`
- New file: `scraper/sources/bosch.selectors.md`
- Modified: `scraper/src/sourceRegistry.ts` — add Bosch entry
