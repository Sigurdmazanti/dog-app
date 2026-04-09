## Why

When running the scraper with `--urls` or `--sitemap`, the process is largely silent during startup and while each URL is being fetched — leaving no visibility into whether anything is actually happening. Given that scraping involves HTTP requests and an AI composition-mapping step that can each take several seconds, the operator has no feedback until a result lands.

## What Changes

- Print a startup summary when the scraper launches (mode, food type, URL source, concurrency)
- Log the total number of URLs parsed and how many are processable vs skipped
- Emit a "starting..." line per URL **before** the fetch begins (so the operator sees activity during long requests)
- Log when the AI composition mapper is invoked for a URL
- Include per-URL elapsed time in the result/failure lines
- Keep the existing `[n/total] ✓ / ✗` format — extend it rather than replace it

## Capabilities

### New Capabilities

- `scraper-run-logging`: Progress and diagnostic logging emitted during a scraper run — startup banner, per-URL lifecycle events, and elapsed timing

### Modified Capabilities

<!-- No existing specs have requirement-level changes -->

## Impact

- `src/scraper.ts` — startup banner in `main()`
- `src/batchScraper.ts` — pre-fetch log line, elapsed time on result lines, upfront URL count
- `src/helpers/runScraper.ts` — log before HTTP fetch and before AI mapping call
- No new dependencies required; uses `console.log` / `Date.now()` only
- No breaking changes; output format is additive
