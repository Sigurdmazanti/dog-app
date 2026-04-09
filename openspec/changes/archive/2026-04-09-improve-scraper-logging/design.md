## Context

The scraper CLI (`scraper/src/scraper.ts`) is a Node.js tool that fetches product pages, parses HTML with Cheerio, and calls an AI composition mapper to extract nutritional data. It runs in three modes: single-URL, `--sitemap`, and `--urls` (batch).

During a batch run (e.g. `npm run dev -- --urls scrape-dry.md --food-type dry`), the operator sees almost nothing until individual results start arriving. There is no confirmation that the run started, no indication of how many URLs were loaded, and no signal that a given URL is being fetched (which can take 5–15 seconds including the AI call). The existing `[n/total] ✓/✗` lines in `batchScraper.ts` are fine but arrive late — only after the work is complete.

## Goals / Non-Goals

**Goals:**
- Print a startup banner immediately on launch (mode, food type, concurrency)
- Log the resolved URL count (parsed, processable, skipped) before work begins
- Emit a `→ scraping` line per URL **before** the HTTP fetch begins
- Log when the AI composition mapper is called (it's the slowest step)
- Include elapsed time (ms) on each `✓` / `✗` result line
- Keep single-URL mode informative rather than just dumping raw JSON at the end

**Non-Goals:**
- Structured/JSON log output (no log levels, no Winston/Pino)
- A progress bar or terminal UI library
- Suppressing existing log lines
- Logging internal HTML parsing steps

## Decisions

### Decision: `console.log` / `Date.now()` only — no logging library

**Rationale:** The scraper is a small CLI tool with no existing logging infrastructure. Adding a library (e.g. Winston, Pino) introduces a dependency, requires a config file, and adds conceptual overhead for what is purely developer-facing output. Plain `console.log` with `Date.now()` deltas is zero-cost and immediately understandable.

**Alternative considered:** `pino` with pretty-print. Rejected — the coloured output during development is nice but the added dependency and config are disproportionate for this scope.

### Decision: Log `→ scraping <url>` at the start of each batch task, not inside `runScraper`

**Rationale:** `runScraper` is a helper used by `scrapeUrl`, which is in turn called by `batchScraper`. The natural owner of "I am about to process item N of total" is `batchScraper`, which already holds the counter and total. Logging at that layer avoids threading counters into `runScraper`.

The **AI mapper** log (`[ai-mapper] calling OpenAI for <url>`) does belong inside `runScraper`/`aiProductCompositionMapper` because the caller doesn't know when that step begins.

### Decision: Elapsed time measured from the start of each batch task (not from launch)

**Rationale:** Per-URL elapsed time is more actionable than wall-clock timestamps. Measuring from the start of the `limit()` callback in `batchScraper` covers both the HTTP fetch and AI mapping time in one number.

## Risks / Trade-offs

- [Risk] Concurrency makes log lines interleave → **Mitigation:** each line is prefixed with `[n/total]` (already present) so lines are attributable even when interleaved
- [Risk] Single-URL mode currently dumps the full JSON result, which is useful for debugging → **Mitigation:** keep the JSON dump but precede it with a human-readable summary line
- [Risk] AI mapper logs are inside a shared helper and will appear for every URL → **Mitigation:** acceptable; it confirms the AI step is running, which is the operator's main concern
