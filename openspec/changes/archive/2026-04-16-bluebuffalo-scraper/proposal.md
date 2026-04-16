## Why

Blue Buffalo is a major US pet food brand widely available in North America. Adding a scraper enables product data collection for nutrition tracking in the dog app.

## What Changes

- New scraper file `scraper/src/scrapers/bluebuffalo.ts` implementing title, ingredients, and guaranteed analysis extraction for `bluebuffalo.com` product pages
- New source file `scraper/sources/bluebuffalo.yaml` listing product URLs by food type
- New selector reference file `scraper/sources/bluebuffalo.selectors.md` documenting HTML selectors
- `scraper/src/sourceRegistry.ts` updated to register the Blue Buffalo scraper

## Capabilities

### New Capabilities

- `bluebuffalo-scraper`: Scraping behaviour, source registry routing, source YAML configuration, and selector documentation for `bluebuffalo.com` product pages

### Modified Capabilities

## Impact

- `scraper/src/scrapers/bluebuffalo.ts` — new file
- `scraper/src/sourceRegistry.ts` — add Blue Buffalo entry
- `scraper/sources/bluebuffalo.yaml` — new file
- `scraper/sources/bluebuffalo.selectors.md` — new file
