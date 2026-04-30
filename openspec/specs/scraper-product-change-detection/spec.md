## Purpose

See the archived change scraper-product-discovery-and-diff for design context.

## Requirements

### Requirement: Per-product content hash

The system SHALL compute a stable hash for each scraped product over a normalised subset of fields: title, composition text, analytical constituents, and ingredients description.

#### Scenario: Two runs of an unchanged product produce the same hash
- **WHEN** the same product page is scraped twice and its title, composition text, analytical constituents, and ingredients description are byte-identical after normalisation
- **THEN** both runs SHALL produce the identical hash value

#### Scenario: Whitespace-only differences do not change the hash
- **WHEN** the only difference between two scrapes of the same product is leading/trailing whitespace, repeated internal whitespace, or line-ending style in the hashed fields
- **THEN** the two runs SHALL produce the identical hash value

### Requirement: Per-source hash cache

The system SHALL persist per-product hashes to `scraper/.cache/<brand>.hashes.json`, keyed by product URL, and the cache directory SHALL be ignored by git.

#### Scenario: Cache is updated after a successful run
- **WHEN** a batch scrape for a source completes successfully
- **THEN** `scraper/.cache/<brand>.hashes.json` SHALL contain an entry for every successfully scraped product URL with its current hash and a `lastSeenAt` ISO timestamp

#### Scenario: Cache is missing on first run
- **WHEN** a source is scraped and no `scraper/.cache/<brand>.hashes.json` exists
- **THEN** every scraped product SHALL be reported as `new` in the change-detection summary, and the cache file SHALL be created at the end of the run

### Requirement: Change-detection summary

When change detection is enabled (default for `batchScraper.ts --source <brand>`), the system SHALL emit a summary that classifies every scraped URL into exactly one of `new`, `changed`, `unchanged`, or `removed`.

#### Scenario: Product content has changed since last run
- **WHEN** a scraped product's current hash differs from its cached hash
- **THEN** the URL SHALL be reported as `changed` with both the previous and current hash values

#### Scenario: Product is in the cache but not in the current run
- **WHEN** a URL has a cached hash but is absent from the current run's scraped products
- **THEN** the URL SHALL be reported as `removed` in the summary

#### Scenario: Change detection is disabled
- **WHEN** `--detect-changes=false` is passed to a batch scrape
- **THEN** no hash comparisons SHALL be performed, no summary SHALL be emitted, and the cache file SHALL NOT be modified
