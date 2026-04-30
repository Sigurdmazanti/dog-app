## Purpose

See the archived change scraper-product-discovery-and-diff for design context.

## Requirements

### Requirement: Per-source declarative listing config

The system SHALL accept an optional `discovery` block in `scraper/sources/<brand>.json` that declares one or more listing-page URLs, each tagged with a food type from the existing food-type vocabulary, plus a CSS selector for product links and optional pagination config.

#### Scenario: Source defines listings for each food type
- **WHEN** a source JSON's `discovery.listings` array contains entries `{ url, foodType }` and `discovery.productLinkSelector` is non-empty
- **THEN** running discovery for that source SHALL fetch each listing URL, extract anchors matching `productLinkSelector`, and tag each resulting product URL with the listing's `foodType`

#### Scenario: Source has empty discovery block
- **WHEN** a source JSON has a `discovery` block with `listings: []` or empty `productLinkSelector`
- **THEN** running discovery for that source SHALL exit with a clear message naming the source and noting that the discovery block must be filled in, and SHALL NOT attempt to crawl any URL

#### Scenario: Source omits the discovery block entirely
- **WHEN** a source JSON has no `discovery` field
- **THEN** running discovery for that source SHALL exit with the same message as the empty-block case

### Requirement: Listing-page pagination

The system SHALL follow pagination on listing pages when a `pagination.nextSelector` is configured, up to a configurable `pagination.maxPages` (default 20), and SHALL deduplicate product URLs across pages.

#### Scenario: Listing has multiple pages
- **WHEN** a listing page contains an anchor matching `pagination.nextSelector` and `maxPages` is not yet reached
- **THEN** the crawler SHALL follow the next-page link, extract its product URLs, and continue until either no `nextSelector` match is found or `maxPages` is reached

#### Scenario: Pagination cap is reached
- **WHEN** the crawler has visited `maxPages` pages of a single listing
- **THEN** the crawler SHALL stop following pagination for that listing and emit a warning naming the listing URL and the cap

### Requirement: AI fallback classification for ungrouped URLs

The system SHALL classify URLs that have no listing-derived `foodType` by fetching the product page, sending title/breadcrumbs/lead paragraph to OpenAI, and assigning a food type only if the model's confidence meets or exceeds a configurable threshold (default `0.8`).

#### Scenario: AI returns a confident classification
- **WHEN** an unclassified URL is sent to the fallback classifier and OpenAI returns a food type with confidence ≥ threshold
- **THEN** the URL SHALL be tagged with that food type and marked with `source: ai`

#### Scenario: AI returns a low-confidence classification
- **WHEN** the classifier returns a confidence below the threshold
- **THEN** the URL SHALL be marked `needs-review` with the model's best guess and confidence value, and SHALL NOT be assigned a definitive food type

#### Scenario: Classifier fetch fails
- **WHEN** fetching the product page fails (network error, HTTP error)
- **THEN** the URL SHALL be marked `needs-review` with the error reason, and the discovery run SHALL continue with the remaining URLs

#### Scenario: URL is already present in source needsReview
- **WHEN** an unclassified URL appears in the source JSON's `needsReview` array from a previous run AND has not been re-grouped by listing crawl
- **THEN** the classifier SHALL NOT re-fetch the URL; the existing `needsReview` entry SHALL be carried forward unchanged

### Requirement: Polite crawling

The crawler SHALL use a configurable delay (default 500ms) between sequential page fetches within a single source, and SHALL send a descriptive `User-Agent` header on every request.

#### Scenario: Delay is enforced between fetches
- **WHEN** the crawler completes one HTTP request and is about to issue the next within the same source
- **THEN** it SHALL wait at least the configured delay before issuing the next request

### Requirement: Per-source ignore list for non-product matches

The system SHALL accept an optional `discovery.ignore` array in the source JSON listing exact URLs to drop from discovery output. Ignored URLs SHALL NOT appear in the diff (`added`, `regrouped`) nor in `needsReview`, regardless of whether they were produced by the listing crawl, carried forward from a prior `needsReview`, or matched in the source's `products` map.

#### Scenario: Listing crawl produces an ignored URL
- **WHEN** the listing crawl extracts a URL whose exact value appears in `discovery.ignore`
- **THEN** the URL SHALL be dropped before classification, SHALL NOT appear in the diff, and SHALL NOT be sent to the AI fallback

#### Scenario: Ignored URL is present in source.products
- **WHEN** a URL in `discovery.ignore` also appears in the source's `products` map and is not produced by the listing crawl
- **THEN** the AI fallback SHALL skip the URL, the URL SHALL NOT appear in `needsReview`, and the URL SHALL appear in the diff's `removed` bucket so the operator can clean it out of `products` on the next `--write`
