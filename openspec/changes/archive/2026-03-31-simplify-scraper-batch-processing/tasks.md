## 1. Source Registry

- [x] 1.1 Create `scraper/src/sourceRegistry.ts` with a `SourceEntry` type (`{ domain: string, scrape: (req: ScrapeRequest) => Promise<ScrapeResult> }`) and export a `sourceRegistry` array containing all 6 existing sources (zooplus, acana-eu, advance, almo-nature, amanova, animonda)
- [x] 1.2 Add `findSource(url: string): SourceEntry | undefined` helper that matches a URL against the registry
- [x] 1.3 Refactor `scrapeUrl()` in `scraper.ts` to use `findSource()` instead of the if/else chain
- [x] 1.4 Verify single-URL scraping still works end-to-end with the registry-based dispatch

## 2. Input Parsers

- [x] 2.1 Create `scraper/src/helpers/sitemapParser.ts` — export `parseSitemapUrls(pathOrUrl: string): Promise<string[]>` that reads a local XML file or fetches a remote URL, parses with `xml2js`, and returns all `<loc>` values
- [x] 2.2 Create `scraper/src/helpers/urlListParser.ts` — export `parseUrlListFile(path: string): string[]` that reads a newline-delimited file, strips blank lines and `#`-prefixed comments, and returns URL strings
- [x] 2.3 Verify both parsers handle error cases (missing file, malformed XML, empty file)

## 3. Batch Orchestrator

- [x] 3.1 Create `scraper/src/batchScraper.ts` — export `runBatch(urls: string[], options: BatchOptions): Promise<BatchSummary>` where `BatchOptions` includes `foodType`, `concurrency`, `appendToSheets`, and sheets config
- [x] 3.2 Implement source-aware URL filtering using `findSource()` — partition input into processable and skipped lists
- [x] 3.3 Implement concurrency-controlled processing using `p-limit` with the configured limit
- [x] 3.4 Implement per-URL progress output (`[current/total] ✓ <title>` or `[current/total] ✗ <url> — <error>`)
- [x] 3.5 Implement `BatchSummary` return type (`{ succeeded: number, failed: number, skipped: number }`) and print summary line at completion
- [x] 3.6 Handle per-row Google Sheets append failures — log and continue, don't abort batch

## 4. CLI Argument Parsing

- [x] 4.1 Rewrite `main()` in `scraper.ts` to parse new flags: `--sitemap <path>`, `--urls <path>`, `--food-type <type>` (default `dry`), `--no-sheets` (default: sheets on), `--concurrency <n>` (default 3)
- [x] 4.2 Implement mode detection: `--sitemap` → sitemap batch, `--urls` → URL-list batch, bare URL → single-URL (backward compatible)
- [x] 4.3 Wire sitemap/URL-list modes to input parsers → batch orchestrator
- [x] 4.4 Wire single-URL mode to existing `scrapeUrl()` with new defaults (sheets on, food type defaulted)
- [x] 4.5 Handle missing Google Sheets config gracefully — warn and skip sheets instead of exiting when in default-on mode
- [x] 4.6 Verify all three modes work: single URL, `--sitemap`, and `--urls`

## 5. Cleanup & Documentation

- [x] 5.1 Remove the old `--append-sheets` flag handling (replaced by default-on behaviour)
- [x] 5.2 Remove unused positional food-type argument parsing (replaced by `--food-type` flag)
- [x] 5.3 Update `scraper/README.md` with new CLI usage examples for all three modes
