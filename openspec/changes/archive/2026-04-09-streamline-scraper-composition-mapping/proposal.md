## Why

Every scraper in `scraper/src/scrapers/` follows an identical structure after extracting DOM content: call `mapProductCompositionWithAI`, log any notes, destructure 8 typed composition sections from the result, and return the same `ScrapeResult` shape. This boilerplate is copy-pasted across all 6 scrapers and will need to be duplicated in every future one. Centralising it reduces maintenance surface and makes adding new scrapers faster.

## What Changes

- Introduce a shared `runScraper` base function that handles: fetching the URL, loading HTML into cheerio, calling `mapProductCompositionWithAI`, logging notes, extracting all typed composition sections, and returning the `ScrapeResult`.
- Each per-brand scraper is refactored to only provide three lightweight extraction functions (title, ingredientsDescription, compositionText) that are passed into `runScraper`.
- The repeated 8-line destructuring block and identical `return` statement are removed from every individual scraper.

## Capabilities

### New Capabilities
- `scraper-base-runner`: A shared base runner utility that encapsulates the fetch → parse → AI-map → type-cast → return pipeline common to all scrapers. Individual scrapers supply brand-specific DOM extraction logic via callback functions.

### Modified Capabilities
<!-- No existing spec-level requirements are changing -->

## Impact

- `scraper/src/scrapers/*.ts` — all 6 existing scrapers refactored (acana-eu, advance, almo-nature, amanova, animonda, zooplus)
- New file: `scraper/src/helpers/runScraper.ts` (or similar)
- No changes to public interfaces (`ScrapeRequest`, `ScrapeResult`, `ScrapeResultMapper`)
- No Supabase schema changes; no app-side changes; no EAS build required
- Purely a scraper-package refactor — hot-reload not applicable (Node.js CLI tool)
