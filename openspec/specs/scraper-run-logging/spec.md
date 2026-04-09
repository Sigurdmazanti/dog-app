### Requirement: Startup banner
The scraper CLI SHALL print a startup banner to stdout immediately when `main()` is entered, before any I/O begins. The banner SHALL include the run mode (single-URL / batch-urls / batch-sitemap), food type, and (for batch modes) the concurrency setting.

#### Scenario: Batch run with --urls
- **WHEN** the operator runs `npm run dev -- --urls scrape-dry.md --food-type dry`
- **THEN** the first output line SHALL contain the mode (`urls`), food type (`dry`), and concurrency value before any URL is fetched

#### Scenario: Single-URL run
- **WHEN** the operator runs `npm run dev -- https://example.com/product --food-type wet`
- **THEN** the first output line SHALL confirm single-URL mode and the food type

### Requirement: URL count summary before batch work begins
Before the first URL is fetched in a batch run, the scraper SHALL log the total number of URLs parsed from the source file/sitemap, how many are processable (matched to a registered source), and how many will be skipped.

#### Scenario: All URLs processable
- **WHEN** a URL list file contains 50 URLs all matched by registered scrapers
- **THEN** the pre-run log SHALL show `50 urls found, 50 processable, 0 skipped`

#### Scenario: Some URLs unrecognised
- **WHEN** a URL list file contains 60 URLs and 8 have no registered scraper
- **THEN** the pre-run log SHALL show `60 urls found, 52 processable, 8 skipped`

### Requirement: Per-URL start log in batch mode
For every processable URL in a batch run, the scraper SHALL emit a log line **before** the HTTP fetch begins, indicating the URL index, total, and the URL being fetched.

#### Scenario: Batch task starts
- **WHEN** a batch task for URL index 3 of 50 begins
- **THEN** a log line SHALL appear as `[3/50] → https://...` before any network call is made for that URL

### Requirement: AI composition mapper invocation log
When the AI composition mapper is called for a URL, it SHALL log a single line indicating it is calling the AI service, including the URL being processed.

#### Scenario: AI mapper is invoked
- **WHEN** `mapProductCompositionWithAI` is called with composition text for a URL
- **THEN** a log line SHALL appear as `[ai-mapper] calling AI for <url>` before the API request is sent

### Requirement: Elapsed time on batch result lines
Each `✓` (success) and `✗` (failure) line in batch mode SHALL include the elapsed time in milliseconds from when that task's fetch began.

#### Scenario: Successful scrape result
- **WHEN** a URL is scraped successfully in 4200 ms
- **THEN** the result line SHALL read `[n/total] ✓ <title> (4200ms)`

#### Scenario: Failed scrape result
- **WHEN** a URL fails after 1800 ms
- **THEN** the result line SHALL read `[n/total] ✗ <url> — <error message> (1800ms)`

### Requirement: Human-readable single-URL result summary
In single-URL mode, before dumping the raw JSON result, the scraper SHALL print a one-line human-readable summary including the product title and total elapsed time.

#### Scenario: Single URL completes
- **WHEN** a single URL is scraped successfully
- **THEN** a summary line SHALL appear as `✓ <title> (<elapsed>ms)` before the JSON dump
