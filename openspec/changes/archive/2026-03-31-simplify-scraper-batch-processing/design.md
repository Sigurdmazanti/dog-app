## Context

The scraper is a Node/TypeScript CLI tool (`scraper/src/scraper.ts`) that fetches dog food product pages, extracts nutritional composition via AI mapping, and optionally appends structured rows to Google Sheets. Today, each invocation processes exactly one URL:

```
npm run dev -- <url> <foodType> [--append-sheets]
```

Processing a full brand catalogue (50-200 products) means manually running this command for each URL. The CLI also requires explicitly passing `--append-sheets` and a food type every time, even though sheets export is the primary use case and food type rarely varies within a brand.

The scraper already has `xml2js` (sitemap parsing) and `p-limit` (concurrency) installed but unused.

## Goals / Non-Goals

**Goals:**
- One command to process all product URLs from a sitemap or URL-list file
- Sensible defaults that eliminate repetitive flags (`--append-sheets` default on, food type defaults to `dry`)
- Concurrency-controlled batch execution with progress output
- Source-aware filtering so unrecognised URLs in a sitemap are skipped, not errored
- Maintain backward compatibility for single-URL invocation

**Non-Goals:**
- Automatic sitemap discovery (user provides the file/URL)
- Deduplication against previously-scraped URLs (future enhancement)
- New scraper source implementations (orthogonal to this change)
- Changes to the AI composition mapper or nutrition calculator logic
- UI/app changes — this is scraper-only

## Decisions

### 1. Source registry replaces if/else URL dispatch

**Decision**: Extract the URL-to-scraper mapping into a declarative `SourceRegistry` — an array of `{ domain: string, scrape: (req) => Promise<ScrapeResult> }` objects. The batch orchestrator queries this registry to filter URLs, and `scrapeUrl()` uses it for dispatch.

**Rationale**: The current if/else chain in `scraper.ts` duplicates domain knowledge that the batch filter also needs. A shared registry is the single source of truth. It also makes adding new sources a one-line registration.

**Alternatives considered**:
- Keep if/else and duplicate domain matching in the filter → duplication, easy to drift
- Dynamic import based on folder convention → over-engineered for 6 sources

### 2. Batch orchestrator as a separate module

**Decision**: New `batchScraper.ts` module that accepts a list of URLs + options, filters through the source registry, and processes them with `p-limit` concurrency. `scraper.ts` remains the CLI entry point and delegates to the batch orchestrator for multi-URL mode.

**Rationale**: Keeps the orchestration logic testable and decoupled from CLI arg parsing. Single-URL mode still calls `scrapeUrl()` directly.

### 3. Input modes: sitemap XML file, URL-list text file, or single URL

**Decision**: Three input modes determined by argument shape:
- Bare URL (`https://...`) → single-URL mode (current behaviour)
- `--sitemap <path-or-url>` → fetch/read sitemap XML, extract `<loc>` URLs
- `--urls <path>` → read newline-delimited file of URLs

**Rationale**: Sitemap XML is the most common machine-readable product index. A plain text file covers cases where the user has a curated list. Both are trivial to parse and cover the user's stated needs.

### 4. Defaults and flag changes

**Decision**:
- Google Sheets append is **on by default**. Opt out with `--no-sheets`.
- Food type defaults to `dry`. Override with `--food-type wet`.
- Concurrency defaults to 3. Override with `--concurrency <n>`.

**Rationale**: The user's primary workflow is "scrape and append to sheets". Making that the zero-flag path eliminates the most common boilerplate. `dry` is the most common food type in the dataset.

### 5. Sitemap URL filtering via source registry

**Decision**: When processing a sitemap or URL list, each URL is checked against `sourceRegistry` domain patterns. Unrecognised URLs are skipped with a log message, not errored.

**Rationale**: Sitemaps contain non-product URLs (category pages, blog posts, etc.). Failing on the first unrecognised URL would break the entire batch.

### 6. Progress and summary output

**Decision**: Print one line per URL as it's processed: `[3/47] ✓ <title>` or `[3/47] ✗ <url> — <error>`. At the end, print a summary: `Done: 42 succeeded, 3 failed, 2 skipped`.

**Rationale**: Long batch runs need visibility. A per-URL line keeps the user informed without flooding the terminal.

## Risks / Trade-offs

- **Google Sheets rate limits** → Mitigation: `p-limit` concurrency cap (default 3) naturally throttles API calls. If issues arise, add exponential backoff later.
- **Large sitemaps with many non-product URLs** → Mitigation: Source registry filtering skips them. Log skipped count in summary so user knows.
- **Sitemap fetching over HTTP adds network dependency** → Mitigation: Support local file paths too. If remote fetch fails, error clearly.
- **Breaking change: `--append-sheets` removed, sheets now default** → Mitigation: Explicitly document `--no-sheets` flag. The old flag can be kept as a no-op with a deprecation warning if desired.
