## Purpose

Define the structure for recording product counts per category directly in each source YAML file.

## Requirements

### Requirement: Source YAML files include product counts
Each source YAML file SHALL have a top-level `productCounts` field containing per-category counts and a total count of all products listed.

#### Scenario: Per-category counts present
- **WHEN** a source YAML has URLs listed under `products.dry`, `products.wet`, `products.treats`, or `products.freeze-dried`
- **THEN** `productCounts` SHALL have a matching sub-key for each category whose value equals the number of URLs in that category's list

#### Scenario: Total count present
- **WHEN** a source YAML has a `productCounts` field
- **THEN** `productCounts.total` SHALL equal the sum of all per-category count values

#### Scenario: Empty category omitted
- **WHEN** a category's URL list is empty
- **THEN** that category's key in `productCounts` SHALL be `0` or omitted, and SHALL NOT inflate the total

#### Scenario: Consistent structure across all files
- **WHEN** any of the 7 source YAML files (`acana-eu`, `acana-us`, `advance`, `almo-nature`, `amanova`, `animonda`, `zooplus`) is read
- **THEN** it SHALL contain a `productCounts` field with the same key structure as its `products` field plus a `total`
