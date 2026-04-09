## Why

Scraper log output is hard to follow during concurrent batch runs: lines from different in-flight URLs interleave without timestamps or consistent context prefixes, making it difficult to correlate AI mapper and sheets logs back to a specific URL. Additionally, AI call failures and timeouts are silently swallowed — operators have no visibility when the AI service is slow or unavailable. The timeout infrastructure already exists in the codebase but is dead code that was never wired up.

## What Changes

- Add ISO timestamps to every log line so lines can be sorted and correlated across concurrent tasks
- Propagate the `[n/total]` batch prefix through to all sub-logs emitted during a URL's processing (AI mapper, sheets appender), so every log line can be attributed to a specific URL
- Log AI call outcomes explicitly: completion with duration, failure with error message, and timeout expiry
- Fix `withTimeout` to actually wrap the OpenAI SDK `create()` call (it is currently dead code)
- Review and document the AI call timeout value; expose it clearly so operators can tune it

## Capabilities

### New Capabilities

*None.*

### Modified Capabilities

- `scraper-run-logging`: Add timestamps to all log lines; propagate URL batch prefix to sub-system logs (AI mapper, sheets); add AI failure and timeout log entries to the per-URL log stream
- `ai-product-composition-mapping`: Enforce request timeout on the OpenAI call (wire up the existing `withTimeout` helper); define and document a sensible default timeout; log when the call times out vs. errors

## Impact

- `scraper/src/helpers/aiProductCompositionMapper.ts` — wire timeout, add outcome logging
- `scraper/src/helpers/runScraper.ts` — pass context prefix through to AI mapper call site
- `scraper/src/batchScraper.ts` — prefix propagation for concurrent tasks
- `scraper/src/helpers/googleSheetsAppender.ts` — accept and use context prefix on log lines
- No external API or schema changes; no new dependencies required
