## Why

The scraper pipeline lacks coverage for Eden Pet Foods (`edenpetfoods.com`), a UK-based premium pet food brand. Adding this scraper enables product data — titles, ingredients, and composition — to be collected and exported to Google Sheets alongside the existing brand catalogue.

## What Changes

- New scraper function for `edenpetfoods.com` product pages
- New source JSON at `scraper/sources/edenpetfoods.json` defining product URL groups (dry, wet, treats, misc) and pagination-based discovery config
- New selector reference at `scraper/sources/edenpetfoods.selectors.md`
- Source registry updated to dispatch `edenpetfoods.com` URLs to the new scraper

## Capabilities

### New Capabilities

- `edenpetfoods-scraper`: Scrapes product title, ingredients description, and composition text from `edenpetfoods.com` product pages; supports paginated category listing discovery with a dual-pagination-element workaround

### Modified Capabilities

<!-- No existing spec-level requirement changes -->

## Impact

- `scraper/src/scrapers/edenpetfoods.ts` — new file
- `scraper/src/sourceRegistry.ts` — new domain entry
- `scraper/sources/edenpetfoods.json` — new source file (dry, wet, treats, misc groups; discovery block with 8-page cap and `.products .product figure.product-image > a` link selector)
- `scraper/sources/edenpetfoods.selectors.md` — new selector reference
- No breaking changes; no app or auth changes required
