## Why

EuroPremium is a European dog food brand whose products are not yet represented in the scraper. Adding it expands the product database and allows users to see nutritional data for EuroPremium dry, wet, treat, and misc products.

## What Changes

- New scraper module `scraper/src/scrapers/europremium.ts` implementing `extractTitle`, `extractIngredientsDescription`, and `extractCompositionText` for `europremium.com`
- New source JSON `scraper/sources/europremium.json` with brand metadata, `discovery` config (single listing page with pagination), and product URL lists for `dry`, `wet`, `treats`, and `misc` food types
- Registration of the `europremium.com` domain → scraper mapping in `scraper/src/sourceRegistry.ts`
- New selector reference doc `scraper/sources/europremium.selectors.md`

## Capabilities

### New Capabilities
- `europremium-scraper`: Scrapes product title, ingredients (Composition accordion), and analytical data (Analytical components accordion) from `europremium.com` product pages using Cheerio; handles discovery via a single paginated listing

### Modified Capabilities

## Impact

- `scraper/src/sourceRegistry.ts`: one new entry
- No app code affected; no Supabase schema changes; no new dependencies
