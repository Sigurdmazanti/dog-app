## MODIFIED Requirements

### Requirement: Blue Buffalo source YAML defines product URLs by food type
The scraper SHALL have a source file at `scraper/sources/bluebuffalo.yaml` listing product URLs grouped by food type (`dry`, `wet`, `treats`, `barf`, `misc`, `freeze-dried`), using `scraper: bluebuffalo` and `domain: bluebuffalo.com`. The `dry`, `wet`, `treats`, `barf`, and `misc` lists SHALL each contain at least one product URL; `freeze-dried` MAY be empty. A `productCounts` map SHALL be present and each count SHALL equal the length of the corresponding URL list.

#### Scenario: Blue Buffalo YAML is loaded without error
- **WHEN** `loadSourceUrls` is called with `bluebuffalo.yaml` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: Dry product list is non-empty
- **WHEN** `bluebuffalo.yaml` is read
- **THEN** `products.dry` SHALL contain at least one `bluebuffalo.com` URL

#### Scenario: Wet product list is non-empty
- **WHEN** `bluebuffalo.yaml` is read
- **THEN** `products.wet` SHALL contain at least one `bluebuffalo.com` URL

#### Scenario: Treats product list is non-empty
- **WHEN** `bluebuffalo.yaml` is read
- **THEN** `products.treats` SHALL contain at least one `bluebuffalo.com` URL

#### Scenario: Barf product list is non-empty
- **WHEN** `bluebuffalo.yaml` is read
- **THEN** `products.barf` SHALL contain at least one `bluebuffalo.com` URL

#### Scenario: Misc product list is non-empty
- **WHEN** `bluebuffalo.yaml` is read
- **THEN** `products.misc` SHALL contain at least one `bluebuffalo.com` URL

#### Scenario: productCounts totals match list lengths
- **WHEN** `bluebuffalo.yaml` is read
- **THEN** each value in `productCounts` SHALL equal the length of the corresponding `products` list, and `productCounts.total` SHALL equal the sum of all per-category counts
