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
When the AI composition mapper is called for a URL, it SHALL log a line when the call begins, a line when the call ends (success or failure), and a line when the call times out. All lines SHALL include the batch context prefix when running in batch mode.

#### Scenario: AI mapper is invoked
- **WHEN** `mapProductCompositionWithAI` is called with composition text for a URL
- **THEN** a log line SHALL appear as `[ai-mapper] calling AI for <url>` before the API request is sent

#### Scenario: AI call succeeds
- **WHEN** the AI API call completes successfully
- **THEN** a log line SHALL appear as `[ai-mapper] done in <duration>ms`

#### Scenario: AI call fails with an error
- **WHEN** the AI API call throws an error (network error, API error, invalid response)
- **THEN** a log line SHALL appear as `[ai-mapper] error after <duration>ms — <message>`

#### Scenario: AI call times out
- **WHEN** the AI API call does not respond within the configured timeout
- **THEN** a log line SHALL appear as `[ai-mapper] timed out after <timeoutMs>ms`

#### Scenario: AI retry logged
- **WHEN** the AI mapper retries after a failure
- **THEN** a log line SHALL appear as `[ai-mapper] retry <n>/<maxRetries> after <delay>ms`

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

### Requirement: Every log line includes an ISO 8601 timestamp
Every line emitted to stdout/stderr by the scraper SHALL be prefixed with an ISO 8601 UTC timestamp so that operators can sort and correlate concurrent log output.

#### Scenario: Log line emitted during batch run
- **WHEN** any log line is emitted during a batch run (startup, per-URL, AI, sheets)
- **THEN** the line SHALL begin with a UTC timestamp in the format `YYYY-MM-DDTHH:mm:ss.SSSZ`

### Requirement: Batch context prefix propagated to all sub-system logs
Every log line emitted while processing a specific URL in batch mode SHALL include the `[n/total]` prefix, including lines from the AI mapper and sheets appender, so that each line can be attributed to a specific URL task.

#### Scenario: AI mapper log during batch run
- **WHEN** the AI mapper emits a log line while processing URL index 5 of 47
- **THEN** the line SHALL include the prefix `[5/47]`

#### Scenario: Sheets appender log during batch run
- **WHEN** the Google Sheets appender emits a log line while appending url index 12 of 47
- **THEN** the line SHALL include the prefix `[12/47]`

#### Scenario: Single-URL run has no batch prefix
- **WHEN** the scraper is run in single-URL mode
- **THEN** no `[n/total]` prefix SHALL appear on log lines (timestamps still present)
