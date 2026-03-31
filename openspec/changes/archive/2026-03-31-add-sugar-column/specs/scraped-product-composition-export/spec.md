## MODIFIED Requirements

### Requirement: Expanded composition model coverage
The scraper domain model MUST define typed fields for the requested composition groups: minerals, salts, vitamins (including B1/B2/B3/B5/B6/B7/B9/B12), amino-acid derivatives, vitamin-like compounds, fatty acids, sugar alcohols, and total sugar within the nutrition group.

#### Scenario: Typed groups are present in contracts
- **WHEN** developers inspect product composition and scrape result interfaces
- **THEN** each requested group and field has an explicit typed property available for parsing and export

#### Scenario: Sugar field is present in NutritionData
- **WHEN** developers inspect the `NutritionData` interface
- **THEN** a `sugar` field of type `number` is available alongside existing macronutrient fields

### Requirement: Alias-based canonical key mapping
The extraction key map MUST normalize source labels using canonical-first alias mapping, where the first configured label is canonical and all subsequent slash-listed labels resolve to that same field.

#### Scenario: Synonym labels resolve to one field
- **WHEN** a page uses any configured alias for a nutrient or additive
- **THEN** the parser stores the value under the canonical field key without creating duplicate keys

#### Scenario: Sugar aliases resolve to the sugar field
- **WHEN** a page uses labels such as "sugar", "sukker", "sugars", or "sukkerarter"
- **THEN** the parser stores the value under the canonical `sugar` field key in `nutritionKeyMap`

### Requirement: Google Sheets export includes expanded fields
The Google Sheets appender MUST serialize output rows using the complete chronological `item_*` column contract and include all expanded composition fields in deterministic order, regardless of whether values were sourced by manual parsing or AI-assisted mapping.

#### Scenario: Export row contains all chronological schema columns
- **WHEN** a scrape result is appended to Google Sheets
- **THEN** the output row contains each configured `item_*` field in the exact chronological order defined by the target schema, including `item_sugar_g_per_100g`

#### Scenario: Sugar column is populated when available
- **WHEN** canonical composition data includes a sugar value
- **THEN** the appender maps the `sugar` field from `nutritionData` to the `item_sugar_g_per_100g` column

#### Scenario: Null-safe export preserves positional integrity
- **WHEN** the sugar value is missing or null
- **THEN** the appender emits an explicit empty/null-safe cell for the sugar position and preserves deterministic column alignment across the full row
