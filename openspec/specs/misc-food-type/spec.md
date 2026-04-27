# Spec: Misc Food Type

## Purpose

Define the `misc` food type as a valid FoodType enum value, its default water percentage, and its integration with source YAML loading and Google Sheets output.

## Requirements

### Requirement: misc food type is a valid FoodType enum value
The `FoodType` enum MUST include a `misc` value (string `"misc"`) to support products that do not fit any existing category.

#### Scenario: misc is a valid enum member
- **WHEN** `FoodType.Misc` is referenced in TypeScript
- **THEN** it resolves to the string `"misc"` without a type error

#### Scenario: misc maps to zero default water percentage
- **WHEN** the water-amount mapper is called with `FoodType.Misc`
- **THEN** it returns `0` as the default water percentage

#### Scenario: misc products are loaded from source YAML
- **WHEN** a YAML source file contains a `misc:` key under `products`
- **THEN** `loadSourceUrls` returns the URLs listed under that key

#### Scenario: misc food type written to Google Sheets output
- **WHEN** a scrape run is executed with `--food-type misc`
- **THEN** the `item_food_type` column in the Sheets append contains the value `"misc"`
