## Why

Bozita is a Swedish pet food brand with a well-structured product website and no existing scraper. Adding it expands the nutritional database with dry, wet, and treat products from a new source.

## What Changes

- New scraper module `scraper/src/scrapers/bozita.ts` that extracts title, ingredients description, and analytical constituents from `bozita.com` product pages
- New source YAML `scraper/sources/bozita.yaml` with 30 dry, 22 wet, and 5 treat product URLs
- New selector reference `scraper/sources/bozita.selectors.md` documenting the HTML structure and CSS selectors
- `scraper/src/sourceRegistry.ts` updated to register the Bozita scraper for `bozita.com` URLs

## Capabilities

### New Capabilities

- `bozita-scraper`: Scrapes product pages on `bozita.com`, extracting the product title from `h1.headline`, the ingredients description from the `<p>` following `<h5>COMPOSITION</h5>` inside `div.product-detail`, and the analytical constituents from the `<p>` following `<h5>ANALYTICAL CONSTITUENTS</h5>` (with additives text appended). Registers the source entry in the source registry and documents selectors.

### Modified Capabilities

## Impact

- New file: `scraper/src/scrapers/bozita.ts`
- New file: `scraper/sources/bozita.yaml`
- New file: `scraper/sources/bozita.selectors.md`
- Modified file: `scraper/src/sourceRegistry.ts`
- No app-layer changes; no Supabase schema changes; no new EAS build required
