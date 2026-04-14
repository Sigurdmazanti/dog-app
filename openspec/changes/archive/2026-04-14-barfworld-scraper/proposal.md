## Why

barfworld.com is a BARF-focused pet food retailer whose products are not yet covered by the scraper pipeline. Adding a scraper enables product composition data to be collected from their catalogue.

## What Changes

- New scraper implementation `scraper/src/scrapers/barfworld.ts`
- New source definition `scraper/sources/barfworld.yaml`
- New selector reference `scraper/sources/barfworld.selectors.md`
- New entry in `scraper/src/sourceRegistry.ts` for `barfworld.com`

## Capabilities

### New Capabilities

- `barfworld-scraper`: Scrape product title, ingredients, and guaranteed analysis (analytical constituents) from product pages on `barfworld.com`, which uses a Shopify-based accordion layout with `#panel-ingredients` and `#panel-guaranteed-analysis` panels and `.metafield-rich_text_field` content containers.

### Modified Capabilities

## Impact

- New files: `scraper/src/scrapers/barfworld.ts`, `scraper/sources/barfworld.yaml`, `scraper/sources/barfworld.selectors.md`
- Modified: `scraper/src/sourceRegistry.ts` (add import + registry entry)
- No changes to the app, Supabase schema, or auth flow
- No new EAS build required
