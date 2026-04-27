## Why

Brit is a major European pet food brand with a large catalogue of dry, wet, treat, and supplement products that is not yet covered by the scraper. Adding it extends nutritional data collection to approximately 161 product pages across four food-type categories.

## What Changes

- Add a new scraper function (`scrapeBrit`) that extracts product title, composition, and analytical constituents from `brit-petfood.com` product pages using Cheerio selectors targeting `h1[itemprop="name"]` and `p` elements with labelled `<strong>` prefixes
- Add `scraper/sources/brit.yaml` with product URL lists for `dry` (49 URLs), `wet` (47 URLs), `treats` (55 URLs), and `misc` (10 URLs), plus a `productCounts` map
- Add `scraper/sources/brit.selectors.md` documenting the homepage URL, a representative HTML excerpt, and the CSS selector table
- Register the `brit-petfood.com` domain in the source registry so `findSource` dispatches to `scrapeBrit`

## Capabilities

### New Capabilities

- `brit-scraper`: Scrape product data (title, composition, analytical constituents, metabolizable energy) from `brit-petfood.com` product pages; source YAML with all known product URLs across dry, wet, treats, and misc categories; selector reference documentation; source registry registration

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- **New files**: `scraper/src/scrapers/brit.ts`, `scraper/sources/brit.yaml`, `scraper/sources/brit.selectors.md`
- **Modified file**: `scraper/src/sources/sourceRegistry.ts` — add Brit entry
- No breaking changes; no app or Supabase schema changes; no new EAS build required
