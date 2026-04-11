## Purpose

Define the structure and loading behaviour of per-brand YAML source files and the supporting `FoodType` enum used throughout the scraper.

## Requirements

### Requirement: Source YAML file defines brand product URLs by food type
The system MUST support a per-brand YAML source file format at `scraper/sources/<scraper-id>.yaml` that specifies the scraper ID, brand name, domain, and product URLs grouped by food type.

#### Scenario: Valid YAML source file is loaded
- **WHEN** a YAML source file exists with a valid `scraper`, `brand`, `domain`, and `products` map
- **THEN** the file is parsed without error and its product URL lists are accessible by food type key

#### Scenario: Food type key maps to FoodType enum value
- **WHEN** a YAML source file contains a `products` map with keys `dry`, `wet`, `treats`, or `freeze-dried`
- **THEN** each key corresponds to a valid `FoodType` enum value and its URL list is accessible by that type

#### Scenario: Missing food type key defaults to empty list
- **WHEN** a YAML source file omits one or more food type keys (e.g. no `treats` key)
- **THEN** querying that food type returns an empty array rather than an error

#### Scenario: Empty URL list for a food type
- **WHEN** a YAML source file has a food type key with an empty array (`[]`)
- **THEN** the system returns an empty list for that food type with no error

### Requirement: loadSourceUrls extracts URLs for a given food type from a YAML source file
The system MUST provide a `loadSourceUrls(yamlPath: string, foodType: FoodType): string[]` function that reads a YAML source file and returns the URL list for the given food type.

#### Scenario: URLs returned for matching food type
- **WHEN** `loadSourceUrls` is called with a valid YAML path and a food type that has entries
- **THEN** it returns the array of URLs defined under that food type key

#### Scenario: Empty array returned for food type with no entries
- **WHEN** `loadSourceUrls` is called with a food type not present or empty in the file
- **THEN** it returns an empty array

#### Scenario: Error thrown if file not found
- **WHEN** `loadSourceUrls` is called with a path that does not exist
- **THEN** it throws an error indicating the file was not found

### Requirement: FoodType enum covers all four supported food categories
The `FoodType` enum MUST include values for `dry`, `wet`, `treats`, and `freeze-dried` to cover all food categories tracked by the scraper.

#### Scenario: Treats food type is valid
- **WHEN** `--food-type treats` is passed to the CLI
- **THEN** the scraper accepts it as a valid food type and processes URLs accordingly

#### Scenario: Freeze-dried food type is valid
- **WHEN** `--food-type freeze-dried` is passed to the CLI
- **THEN** the scraper accepts it as a valid food type and processes URLs accordingly
