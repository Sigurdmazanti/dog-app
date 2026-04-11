## Purpose

Define the `barf` food type as a valid category in the scraper's FoodType enum and supporting infrastructure.

## Requirements

### Requirement: barf food type is a valid FoodType enum value
The `FoodType` enum MUST include a `barf` value (string `"barf"`) to support BARF (Biologically Appropriate Raw Food) products as a distinct category.

#### Scenario: barf is a valid enum member
- **WHEN** `FoodType.Barf` is referenced in TypeScript
- **THEN** it resolves to the string `"barf"` without a type error

#### Scenario: barf maps to zero default water percentage
- **WHEN** the water-amount mapper is called with `FoodType.Barf`
- **THEN** it returns `0` as the default water percentage

#### Scenario: barf products are loaded from source YAML
- **WHEN** a YAML source file contains a `barf:` key under `products`
- **THEN** `loadSourceUrls` returns the URLs listed under that key

#### Scenario: barf food type written to Google Sheets output
- **WHEN** a scrape run is executed with `--food-type barf`
- **THEN** the `item_food_type` column in the Sheets append contains the value `"barf"`
