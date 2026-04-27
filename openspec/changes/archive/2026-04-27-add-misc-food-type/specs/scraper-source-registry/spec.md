## ADDED Requirements

### Requirement: ScrapeDataRow.foodType is typed as FoodType
The `foodType` field on `ScrapeDataRow` MUST be typed as `FoodType` (not `string`) to ensure only valid enum values are assignable.

#### Scenario: FoodType enum value assigned to ScrapeDataRow
- **WHEN** `scrapeUrl` builds a `ScrapeDataRow` with a valid food type argument
- **THEN** `ScrapeDataRow.foodType` holds a `FoodType` enum value and a raw string not in the enum SHALL cause a TypeScript compile error

## MODIFIED Requirements

### Requirement: FoodType enum covers all four supported food categories
The `FoodType` enum MUST include values for `dry`, `wet`, `treats`, `freeze-dried`, and `misc` to cover all food categories tracked by the scraper.

#### Scenario: Treats food type is valid
- **WHEN** `--food-type treats` is passed to the CLI
- **THEN** the scraper accepts it as a valid food type and processes URLs accordingly

#### Scenario: Freeze-dried food type is valid
- **WHEN** `--food-type freeze-dried` is passed to the CLI
- **THEN** the scraper accepts it as a valid food type and processes URLs accordingly

#### Scenario: Misc food type is valid
- **WHEN** `--food-type misc` is passed to the CLI
- **THEN** the scraper accepts it as a valid food type and processes URLs accordingly

## MODIFIED Requirements

### Requirement: Source YAML file defines brand product URLs by food type
The system MUST support a per-brand YAML source file format at `scraper/sources/<scraper-id>.yaml` that specifies the scraper ID, brand name, domain, and product URLs grouped by food type.

#### Scenario: Valid YAML source file is loaded
- **WHEN** a YAML source file exists with a valid `scraper`, `brand`, `domain`, and `products` map
- **THEN** the file is parsed without error and its product URL lists are accessible by food type key

#### Scenario: Food type key maps to FoodType enum value
- **WHEN** a YAML source file contains a `products` map with keys `dry`, `wet`, `treats`, `freeze-dried`, or `misc`
- **THEN** each key corresponds to a valid `FoodType` enum value and its URL list is accessible by that type

#### Scenario: Missing food type key defaults to empty list
- **WHEN** a YAML source file omits one or more food type keys (e.g. no `misc` key)
- **THEN** querying that food type returns an empty array rather than an error

#### Scenario: Empty URL list for a food type
- **WHEN** a YAML source file has a food type key with an empty array (`[]`)
- **THEN** the system returns an empty list for that food type with no error
