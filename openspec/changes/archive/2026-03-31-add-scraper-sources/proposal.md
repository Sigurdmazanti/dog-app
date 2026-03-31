## Why

The scraper currently only supports two sources (ZooPlus and Acana EU). The `sources.md` reference file lists five brands, but three of them — Advance, Almo Nature, Amanova, and Animonda — have no corresponding scraper implementation. Adding these scrapers expands product coverage and brings the scraper in line with its intended source list.

## What Changes

- Add a new scraper file for each unsupported source: `advance.ts`, `almo-nature.ts`, `amanova.ts`, `animonda.ts`
- Each scraper uses Cheerio to extract title, ingredients, and composition text from the brand's HTML structure, then delegates to the existing AI composition mapper
- Update `scraper.ts` URL routing to dispatch to the correct scraper based on the incoming URL
- Fix the existing missing `else if` bug in the URL routing chain (currently `acana` branch lacks `else`)

## Capabilities

### New Capabilities
- `multi-source-scraping`: Per-brand scraper modules for Advance, Almo Nature, Amanova, and Animonda, following the same pattern as the existing Acana EU scraper

### Modified Capabilities
- `scraped-product-composition-export`: The URL dispatch logic in `scraper.ts` is extended to route new domains to their scrapers

## Impact

- **Code**: `scraper/src/scrapers/` gains four new files; `scraper/src/scraper.ts` import list and URL-matching block grow
- **Dependencies**: No new runtime dependencies — all scrapers use existing `axios`, `cheerio`, and `mapProductCompositionWithAI`
- **Systems**: No schema or Supabase changes; output format unchanged
