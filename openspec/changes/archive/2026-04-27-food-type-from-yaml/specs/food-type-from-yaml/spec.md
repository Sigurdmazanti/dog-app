## ADDED Requirements

### Requirement: URL-to-food-type pairing from YAML source files
The system SHALL provide a `UrlWithFoodType` interface containing `url: string` and `foodType: FoodType` fields. When loading URLs from a YAML source file, the system MUST return an array of `UrlWithFoodType` objects by iterating all keys in the `products` map and pairing each URL with its parent key as the food type.

#### Scenario: All food types loaded from YAML
- **WHEN** `loadSourceUrls` is called with a YAML file containing URLs under `products.dry` (3 URLs) and `products.wet` (2 URLs) and no food-type filter
- **THEN** it returns 5 `UrlWithFoodType` objects — 3 with `foodType: 'dry'` and 2 with `foodType: 'wet'`

#### Scenario: Empty food-type keys excluded
- **WHEN** a YAML file has `products.dry` with 2 URLs and `products.treats` as an empty array
- **THEN** only the 2 dry URLs are returned; no entries for treats appear in the result

#### Scenario: Single food-type filter applied
- **WHEN** `loadSourceUrls` is called with a YAML file and a food-type filter of `wet`
- **THEN** only URLs under `products.wet` are returned, each paired with `foodType: 'wet'`

### Requirement: Per-URL food type in batch processing
The batch processor (`runBatch`) MUST accept an array of `UrlWithFoodType` objects and use each URL's individual `foodType` when constructing the `ScrapeRequest`, rather than applying a single global food type.

#### Scenario: Mixed food types in single batch
- **WHEN** a batch contains 2 dry URLs and 1 wet URL
- **THEN** the 2 dry URLs are scraped with `foodType: 'dry'` and the 1 wet URL is scraped with `foodType: 'wet'`

#### Scenario: Water default varies per URL
- **WHEN** a batch contains a dry URL and a wet URL
- **THEN** the dry URL uses the dry default water amount and the wet URL uses the wet default water amount in nutrition calculations
