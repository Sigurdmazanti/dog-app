## Purpose

Define the scraper's batch processing capabilities: sitemap and URL-list input modes, concurrency control, source-aware filtering, and progress/summary reporting.

## Requirements

### Requirement: Batch processing from sitemap XML
The system MUST accept a `--sitemap <path-or-url>` flag that reads a sitemap XML file (local path or remote URL), extracts all `<loc>` URLs, filters them through the source registry, and processes each matching URL.

#### Scenario: Local sitemap file processed
- **WHEN** the CLI is invoked with `--sitemap ./sitemap.xml` and the file contains 50 `<loc>` entries of which 30 match registered sources
- **THEN** the system processes the 30 matching URLs, skips the 20 unrecognised URLs with log messages, and outputs a summary

#### Scenario: Remote sitemap URL processed
- **WHEN** the CLI is invoked with `--sitemap https://example.com/sitemap.xml`
- **THEN** the system fetches the XML over HTTP, extracts `<loc>` URLs, and processes matching URLs identically to a local file

#### Scenario: Sitemap file not found
- **WHEN** the CLI is invoked with `--sitemap ./missing.xml` and the file does not exist
- **THEN** the system prints an error message and exits with a non-zero code

#### Scenario: Invalid sitemap XML
- **WHEN** the sitemap file contains malformed XML
- **THEN** the system prints a parse error message and exits with a non-zero code

### Requirement: Batch processing from URL list file
The system MUST accept a `--urls <path>` flag. When the path points to a `.yaml` or `.yml` file, it SHALL be treated as a brand source file. If `--food-type` is provided, only URLs for that food type SHALL be loaded from the `products.<food-type>` key. If `--food-type` is omitted, URLs from ALL food-type keys in the `products` map SHALL be loaded, each paired with its corresponding food type. When the path points to any other file type, the existing plain-text/markdown URL list behaviour is preserved. Markdown list prefixes (`- `, `* `, `1. `), markdown link syntax (`[text](url)`), headings, and blank lines MUST be handled transparently for non-YAML files.

#### Scenario: YAML source file processed with food type filter
- **WHEN** the CLI is invoked with `--urls sources/acana-eu.yaml --food-type dry`
- **THEN** the system loads only the URLs under `products.dry` in that file and processes them with `foodType: 'dry'`

#### Scenario: YAML source file processed without food type filter
- **WHEN** the CLI is invoked with `--urls sources/acana-eu.yaml` and no `--food-type` flag
- **THEN** the system loads URLs from all non-empty food-type keys in the YAML and processes each URL with its corresponding food type

#### Scenario: YAML source file with no entries for food type produces empty batch
- **WHEN** the CLI is invoked with `--urls sources/acana-eu.yaml --food-type treats` and the file has an empty `treats` list
- **THEN** the system prints a warning that no URLs were found and exits without error

#### Scenario: URL list file processed
- **WHEN** the CLI is invoked with `--urls ./products.txt` containing 10 URLs (8 matching registered sources)
- **THEN** the system processes the 8 matching URLs, skips the 2 unrecognised URLs, and outputs a summary

#### Scenario: Markdown URL list file processed
- **WHEN** the CLI is invoked with `--urls ./products.md` containing markdown-formatted URLs (headings, bullet lists, numbered lists)
- **THEN** the system extracts URLs from list items and markdown links, skips headings and blank lines, and processes matching URLs identically to a plain text file

#### Scenario: Empty lines and comments ignored
- **WHEN** the URL list file contains blank lines or lines starting with `#`
- **THEN** those lines are silently skipped without counting as failures or skips

#### Scenario: URL list file not found
- **WHEN** the CLI is invoked with `--urls ./missing.txt` and the file does not exist
- **THEN** the system prints an error message and exits with a non-zero code

### Requirement: Concurrency-controlled execution
The system MUST process batch URLs with a configurable concurrency limit, defaulting to 3 concurrent requests.

#### Scenario: Default concurrency
- **WHEN** a batch of 20 URLs is processed without a `--concurrency` flag
- **THEN** at most 3 URLs are being scraped simultaneously at any point

#### Scenario: Custom concurrency
- **WHEN** the CLI is invoked with `--concurrency 5`
- **THEN** at most 5 URLs are being scraped simultaneously at any point

### Requirement: Source-aware URL filtering
The system MUST filter batch input URLs against the source registry and skip URLs that do not match any registered source domain.

#### Scenario: Unrecognised URL skipped
- **WHEN** a batch contains a URL that does not match any registered scraper source
- **THEN** that URL is skipped with a log message and does not cause the batch to fail

#### Scenario: All URLs unrecognised
- **WHEN** every URL in the batch is unrecognised
- **THEN** the system prints a warning that no processable URLs were found and exits with code 0

### Requirement: Per-URL progress output
The system MUST print a progress line for each URL as it completes processing during a batch run.

#### Scenario: Successful scrape progress
- **WHEN** a URL is successfully scraped in a batch of N URLs
- **THEN** the system prints a line in the format `[current/total] ✓ <product title>`

#### Scenario: Failed scrape progress
- **WHEN** a URL fails during batch processing
- **THEN** the system prints a line in the format `[current/total] ✗ <url> — <error message>` and continues processing remaining URLs

### Requirement: Batch summary output
The system MUST print a summary line after all batch URLs have been processed.

#### Scenario: Mixed results summary
- **WHEN** a batch completes with some successes, failures, and skips
- **THEN** the system prints a summary in the format `Done: X succeeded, Y failed, Z skipped`

#### Scenario: All successful summary
- **WHEN** all batch URLs complete successfully
- **THEN** the system prints `Done: X succeeded, 0 failed, 0 skipped`
