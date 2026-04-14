## Why

Bellfor (bellfor.info) is a German pet food brand with a range of grain-free wet and dry dog food products that are not yet covered by the scraper. Adding this source expands nutritional data coverage for dog app users comparing hypoallergenic and insect-based foods.

## What Changes

- New scraper `bellfor.ts` that extracts product title, ingredients, and analytical constituents from `bellfor.info` product pages
- New source file `scraper/sources/bellfor.yaml` listing product URLs grouped by food type
- New selector reference `scraper/sources/bellfor.selectors.md` documenting the HTML structure and selectors
- Registration of `scrapeBellfor` in `sourceRegistry.ts`

## Capabilities

### New Capabilities
- `bellfor-scraper`: Scraper, source YAML, selector reference, and source registry entry for extracting dog food product data from `bellfor.info`

### Modified Capabilities

## Impact

- `scraper/src/scrapers/bellfor.ts` — new file
- `scraper/sources/bellfor.yaml` — new source config
- `scraper/sources/bellfor.selectors.md` — new selector reference
- `scraper/src/sourceRegistry.ts` — add Bellfor entry
