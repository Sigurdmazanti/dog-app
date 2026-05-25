## Why

Edgard & Cooper is a popular European premium pet food brand with a broad range of dry, wet, treat, and dental products. Adding a scraper enables their product nutrition data to be harvested and included in the dog food database alongside other supported brands.

## What Changes

- New scraper module `scraper/src/scrapers/edgard-cooper.ts` implementing `scrapeEdgardCooper`
- New source config `scraper/sources/edgard-cooper.json` with product URLs and discovery config for dry, wet, treats, and misc (dental) categories
- New selector reference `scraper/sources/edgard-cooper.selectors.md` documenting the HTML structure
- Registration in `scraper/src/sourceRegistry.ts` mapping `edgardcooper.com` to `scrapeEdgardCooper`

## Capabilities

### New Capabilities

- `edgard-cooper-scraper`: Scrapes product title, ingredients description, and composition text from `edgardcooper.com` product pages using Cheerio CSS selectors against the server-rendered HTML; registers the domain in the source registry and provides source JSON with product URLs for dry, wet, treats, and misc food types

### Modified Capabilities

## Impact

- `scraper/src/sourceRegistry.ts`: new entry for `edgardcooper.com`
- `scraper/src/scrapers/edgard-cooper.ts`: new file
- `scraper/sources/edgard-cooper.json`: new file
- `scraper/sources/edgard-cooper.selectors.md`: new file
- No React Native app changes; no Supabase schema changes; no EAS build required
