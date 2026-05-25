## Why

Alpha Spirit (alphaspirit.se) is a Swedish pet food brand selling dry, wet, and treat products. Adding a scraper enables product data collection from this retailer's WooCommerce/Elementor site so their product nutritional data can be included in the dog food database.

## What Changes

- New scraper file `scraper/src/scrapers/alphaspirit.ts` to extract title, ingredients description, and composition text from alphaspirit.se product pages
- New source JSON `scraper/sources/alphaspirit.json` with product category URLs for dry, wet, and treat food types
- New entry in `scraper/src/sourceRegistry.ts` mapping `alphaspirit.se` to the new scraper
- New selector reference doc `scraper/sources/alphaspirit.selectors.md`

## Capabilities

### New Capabilities
- `alphaspirit-scraper`: Scrapes product title, composition (ingredients), and analytical constituents from alphaspirit.se product pages; includes source JSON with dry/wet/treats product URLs and a selector reference document

### Modified Capabilities

(none)

## Impact

- `scraper/src/scrapers/alphaspirit.ts` — new file
- `scraper/sources/alphaspirit.json` — new file
- `scraper/sources/alphaspirit.selectors.md` — new file
- `scraper/src/sourceRegistry.ts` — one new entry added
- No dependency changes; existing Swedish composition key mappings (`aska`, `fett`, `växttråd`, `järn`) already handle Swedish-language analytical labels
