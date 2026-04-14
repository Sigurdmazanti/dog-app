## Why

The Belcando website has updated its product detail page HTML structure: product names are now split across two elements — a `span.product-detail-name-manufacturer` for the brand/line (e.g. "Vetline") and an `h1.product-detail-name` for the product name (e.g. "Weight Control") — instead of a single `h1[itemprop="name"]`. The current scraper only captures what is in the `h1`, producing incomplete titles like "Weight Control" instead of "Vetline Weight Control".

## What Changes

- Update the `extractTitle` selector in `belcando.ts` to concatenate `span.product-detail-name-manufacturer` and `h1.product-detail-name` (trimmed, joined with a space), falling back gracefully when the manufacturer span is absent
- Update the HTML example and Title selector row in `belcando.selectors.md` to reflect the new structure

## Capabilities

### New Capabilities
<!-- None — this is a maintenance fix to an existing scraper -->

### Modified Capabilities
- `belcando-scraper`: Title extraction requirement changes — must now combine manufacturer sub-label and product-name heading into a single concatenated title string

## Impact

- `scraper/src/scrapers/belcando.ts` — `extractTitle` logic
- `scraper/sources/belcando.selectors.md` — HTML example and Selectors table
