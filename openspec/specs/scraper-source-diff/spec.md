## Purpose

See the archived change scraper-product-discovery-and-diff for design context.

## Requirements

### Requirement: Diff report against source JSON

The system SHALL compare the discovered URL set against the `products` map in the source JSON file and produce a structured diff containing four buckets: `added`, `removed`, `regrouped`, and `needsReview`.

#### Scenario: New URL appears in discovery
- **WHEN** a discovered URL is not present in any group of the source JSON's `products`
- **THEN** the URL SHALL appear in the `added` bucket tagged with its discovered food type

#### Scenario: Existing URL no longer discovered
- **WHEN** a URL present in the source JSON's `products` is not produced by discovery
- **THEN** the URL SHALL appear in the `removed` bucket tagged with its prior food type

#### Scenario: Existing URL discovered under a different food type
- **WHEN** a URL is present in the source JSON under one food type and discovery assigns it a different food type
- **THEN** the URL SHALL appear in the `regrouped` bucket with both `from` and `to` food types

#### Scenario: Discovered URL has no confident food type
- **WHEN** a URL is discovered but classified as `needs-review`
- **THEN** the URL SHALL appear in the `needsReview` bucket with the classifier's best guess and confidence, and SHALL NOT appear in `added` or `regrouped`

### Requirement: Safety guard against catastrophic listing failure

The system SHALL refuse to perform a write-back if the discovered URL count for any food type drops by more than 50% relative to the source JSON's existing count for that food type, unless the operator passes `--force`.

#### Scenario: Listing returns far fewer products than expected
- **WHEN** discovery for a food type returns fewer than 50% of the URLs currently listed in the source JSON for that food type AND `--write` was passed without `--force`
- **THEN** the system SHALL exit non-zero with a message naming the food type, the prior count, the discovered count, and the `--force` escape hatch, and SHALL NOT mutate the source JSON

#### Scenario: Operator overrides the guard
- **WHEN** discovery would trip the 50% guard AND `--force` is also passed
- **THEN** the system SHALL log a warning identifying the food type and counts, and SHALL proceed with the write

### Requirement: Opt-in JSON write-back

The system SHALL only mutate `scraper/sources/<brand>.json` when `--write` is passed, SHALL apply the diff atomically (all-or-nothing per file), and SHALL write `needs-review` URLs into the top-level `needsReview` array — never into `products`.

#### Scenario: Discovery is run without --write
- **WHEN** the operator runs discovery without `--write`
- **THEN** the system SHALL print the diff report to stdout and SHALL leave the source JSON byte-identical to its previous contents

#### Scenario: Discovery is run with --write
- **WHEN** the operator runs discovery with `--write` and the safety guard does not trip
- **THEN** the system SHALL apply the `added`, `removed`, and `regrouped` buckets to the JSON's `products` map, replace the `needsReview` array with the current run's `needsReview` bucket, and write the result via `JSON.stringify(obj, null, 2)` followed by a trailing newline

#### Scenario: Write fails mid-flight
- **WHEN** the file system rejects the write (permissions, disk full)
- **THEN** the system SHALL exit non-zero, leave the original source JSON unchanged on disk, and report the error
