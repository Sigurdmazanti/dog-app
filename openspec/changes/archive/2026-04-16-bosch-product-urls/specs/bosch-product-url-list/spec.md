## ADDED Requirements

### Requirement: Bosch source YAML contains product URLs for all categories
The `scraper/sources/bosch.yaml` file SHALL contain non-empty URL lists for `dry`, `wet`, `treats`, and `misc` categories, with `productCounts` reflecting the exact number of URLs in each list and an accurate `total`.

#### Scenario: dry products list is populated
- **WHEN** `bosch.yaml` is read
- **THEN** the `products.dry` list SHALL contain all provided dry food URLs and `productCounts.dry` SHALL equal the count of those URLs

#### Scenario: wet products list is populated
- **WHEN** `bosch.yaml` is read
- **THEN** the `products.wet` list SHALL contain all provided wet food URLs and `productCounts.wet` SHALL equal the count of those URLs

#### Scenario: treats list is populated
- **WHEN** `bosch.yaml` is read
- **THEN** the `products.treats` list SHALL contain all provided treat URLs and `productCounts.treats` SHALL equal the count of those URLs

#### Scenario: misc list is populated
- **WHEN** `bosch.yaml` is read
- **THEN** the `products.misc` list SHALL contain all provided misc URLs and `productCounts.misc` SHALL equal the count of those URLs

#### Scenario: total count is correct
- **WHEN** `bosch.yaml` is read
- **THEN** `productCounts.total` SHALL equal the sum of `dry + wet + treats + misc`
