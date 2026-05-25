## Why

Butternutbox is a UK-based fresh dog food brand with a meaningful product catalogue (meals, treats, supplements) that is not yet covered by the scraper. Adding it expands nutritional data coverage for users feeding fresh/wet food.

## What Changes

- New scraper for `butternutbox.com` product pages
- New source JSON file with wet, treats, and misc product URLs
- New selector reference document covering the MUI-based React markup
- Registration of the butternutbox domain in `sourceRegistry.ts`

## Capabilities

### New Capabilities

- `butternutbox-scraper`: Scraper for butternutbox.com that extracts product title, ingredients description, and analytical constituents from MUI Accordion sections within a React-rendered product page

### Modified Capabilities

<!-- none -->

## Impact

- `scraper/src/scrapers/butternutbox.ts` — new file
- `scraper/sources/butternutbox.json` — new source JSON with wet, treats, and misc product URLs
- `scraper/sources/butternutbox.selectors.md` — new selector reference
- `scraper/src/sourceRegistry.ts` — domain registration added
