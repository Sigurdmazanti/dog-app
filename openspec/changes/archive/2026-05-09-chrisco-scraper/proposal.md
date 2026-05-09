## Why

The scraper pipeline is missing coverage for Chrisco (chrisco.dk), a Danish pet brand that sells dog food, treats, and chews. Adding this scraper expands the nutrition database with Chrisco products.

## What Changes

- New scraper file `scraper/src/scrapers/chrisco.ts` implementing page extraction for `chrisco.dk` product pages
- New source JSON `scraper/sources/chrisco.json` with product URL lists for `dry`, `wet`, and `treats` food types
- New selector reference `scraper/sources/chrisco.selectors.md` documenting the HTML structure
- Source registry updated to route `chrisco.dk` URLs to the new scraper

## Capabilities

### New Capabilities

- `chrisco-scraper`: Scrape product title, ingredients description, and analytical constituents from `chrisco.dk` product pages using Cheerio selectors targeting the Magento-based tab structure (`#amcustomtabs_tabs_12` for nutritional content, `h1.page-title` for title)

### Modified Capabilities

<!-- none -->

## Impact

- `scraper/src/scrapers/chrisco.ts` — new file
- `scraper/sources/chrisco.json` — new file
- `scraper/sources/chrisco.selectors.md` — new file
- `scraper/src/sourceRegistry.ts` — add `chrisco.dk` domain mapping
