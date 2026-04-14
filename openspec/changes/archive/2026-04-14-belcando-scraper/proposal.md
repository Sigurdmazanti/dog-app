## Why

Belcando is a premium German pet food brand whose products are not yet indexed in the app's nutrition database. Adding a scraper enables product composition data to be collected from `belcando.com` for use in dog nutrition tracking.

## What Changes

- New scraper module `scraper/sources/belcando.ts` targeting `belcando.com` product pages
- New source YAML `scraper/sources/belcando.yaml` cataloguing product URLs by food type (initially dry food)
- New selector reference `scraper/sources/belcando.selectors.md` documenting the HTML structure and Cheerio selectors
- Source registry updated to route `belcando.com` URLs to the new scraper

## Capabilities

### New Capabilities

- `belcando-scraper`: Scrape product title, ingredients description (composition), and analytical constituents from `belcando.com` product detail pages

### Modified Capabilities

- `scraper-source-registry`: Register the `belcando.com` domain so `findSource` dispatches to the new scraper

## Impact

- New files: `scraper/src/scrapers/belcando.ts`, `scraper/sources/belcando.yaml`, `scraper/sources/belcando.selectors.md`
- Modified files: `scraper/src/sourceRegistry.ts`
- No auth, Supabase schema, or app UI changes required
- No new EAS build needed — scraper runs in Node outside the mobile app
