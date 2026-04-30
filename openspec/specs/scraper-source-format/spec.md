## Purpose

See the archived change scraper-product-discovery-and-diff for design context.

## Requirements

### Requirement: Per-brand JSON source file

Each scraper source SHALL be stored as a single JSON file at `scraper/sources/<brand>.json` containing the brand metadata, an optional `discovery` block, the `products` URL map grouped by food type, and an optional `needsReview` array.

#### Scenario: Source file is loaded
- **WHEN** any scraper component reads a source for `<brand>`
- **THEN** it SHALL read `scraper/sources/<brand>.json`, parse it with `JSON.parse`, and never invoke a YAML parser

#### Scenario: Source file is missing
- **WHEN** code attempts to load a source for a brand whose JSON file does not exist
- **THEN** it SHALL throw an error naming the brand and the expected path

### Requirement: Source file required fields

A source JSON file SHALL contain `scraper` (kebab-case identifier matching the filename), `brand` (display name), `domain` (primary host), and `products` (object keyed by food type with arrays of absolute URLs).

#### Scenario: Required field is missing
- **WHEN** a source JSON file is loaded and any of `scraper`, `brand`, `domain`, or `products` is absent
- **THEN** the loader SHALL throw a validation error naming the missing field and the source file path

#### Scenario: products contains a non-absolute URL
- **WHEN** any URL in any food-type array is not an absolute URL
- **THEN** the loader SHALL throw a validation error naming the offending URL and the food type

### Requirement: Product counts are derived, not stored

The system SHALL compute product counts from the `products` map at read time and SHALL NOT persist a `productCounts` field in the source JSON.

#### Scenario: Caller requests a count
- **WHEN** a caller asks for the total or per-food-type product count for a source
- **THEN** the value SHALL be computed from `Object.values(source.products).flat().length` (or the per-key length) at call time

#### Scenario: Source file contains a productCounts field
- **WHEN** a source JSON file is loaded and contains a `productCounts` field
- **THEN** the loader SHALL ignore the field (it is not part of the schema) and SHALL NOT raise an error, to keep migration backstops tolerant

### Requirement: One-shot manual migration from YAML

The YAML→JSON conversion SHALL be performed once during implementation as a manual edit pass, not via a committed script. After implementation completes, no `scraper/sources/*.yaml` files SHALL remain and `js-yaml` SHALL NOT appear in `scraper/package.json` or `scraper/package-lock.json`.

#### Scenario: Each brand's product total is preserved
- **WHEN** a brand's YAML is converted to JSON
- **THEN** `Object.values(json.products).flat().length` SHALL equal that brand's prior YAML `productCounts.total`, and the YAML SHALL only be deleted once that equality is verified

#### Scenario: No YAML files remain after migration
- **WHEN** the migration commit lands
- **THEN** `scraper/sources/` SHALL contain zero `*.yaml` or `*.yml` files, and a workspace search for `js-yaml` under `scraper/` SHALL return no matches

### Requirement: needsReview persistence in source file

The source JSON file SHALL support a top-level `needsReview` array of `{ url, bestGuess, confidence, reason? }` entries persisted across discovery runs. The array MAY be empty but the field MUST be preserved across reads and writes.

#### Scenario: needs-review URL is added during discovery write-back
- **WHEN** discovery runs with `--write` and produces `needs-review` entries
- **THEN** those entries SHALL be written into the source JSON's `needsReview` array (deduplicated by URL) and SHALL NOT be written into `products`

#### Scenario: Reviewer manually triages a needsReview entry
- **WHEN** a reviewer moves a URL from `needsReview` into the appropriate `products` food-type list and removes it from `needsReview`
- **THEN** subsequent discovery runs SHALL treat the URL as a known product and SHALL NOT re-classify it via the AI fallback
