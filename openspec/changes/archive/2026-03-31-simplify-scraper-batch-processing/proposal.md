## Why

The scraper CLI requires manually running `npm run dev -- <url> <foodType> --append-sheets` for every single product URL. Processing an entire brand catalogue means dozens of repetitive manual invocations. There is no way to feed a list of URLs or a sitemap and let the scraper batch-process them. The current CLI also requires specifying food type per-invocation even though it could be inferred or defaulted.

## What Changes

- **New batch mode**: Accept a sitemap XML file, a plain-text URL list file, or a glob of URLs as input, and process all matching product URLs in one run with concurrency control.
- **Simplified single-URL mode**: Make `--append-sheets` the default behaviour (opt-out with `--no-sheets`), infer food type from product page metadata when possible, and default to `dry` when ambiguous.
- **Source-aware URL filtering**: When processing a sitemap or URL list, automatically filter to only URLs matching registered scraper sources (skip unrecognised domains instead of erroring).
- **Progress & summary reporting**: Show per-URL progress (success/skip/fail) during batch runs and print a summary at the end.

## Capabilities

### New Capabilities
- `batch-scraper-processing`: Batch input modes (sitemap XML, URL list file, inline URL list), concurrency-controlled processing, source-aware filtering, progress reporting, and summary output.
- `scraper-cli-simplification`: Simplified CLI flags and defaults — sheets-by-default, food-type inference/defaulting, reduced boilerplate per invocation.

### Modified Capabilities
- `multi-source-scraping`: The URL dispatch mechanism changes from a hard-coded if/else chain to a source registry that batch processing can query for supported domains.
- `scraped-product-composition-export`: Google Sheets appending becomes the default export path; the append function must handle batch rows and partial-failure scenarios gracefully.

## Impact

- **Code**: `scraper/src/scraper.ts` (CLI arg parsing, main entrypoint rewrite), new batch orchestrator module, new sitemap/URL-list parser module, refactored source registry.
- **Dependencies**: `xml2js` already installed for sitemap parsing; `p-limit` already installed for concurrency. No new deps expected.
- **APIs**: Google Sheets append called in batch (rate-limit awareness needed).
- **Systems**: No infrastructure changes. Env vars unchanged.
