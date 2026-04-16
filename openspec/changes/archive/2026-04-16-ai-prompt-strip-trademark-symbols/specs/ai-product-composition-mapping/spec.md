## MODIFIED Requirements

### Requirement: AI mapper returns canonical composition schema
The scraper MUST produce AI-mapped composition output that remains compatible with the canonical export schema used by the Google Sheets appender, including the `sugar` field in `nutritionData` required to populate the `item_sugar_g_per_100g` column. Product name and brand name fields in the AI output MUST NOT contain trademark (™), copyright (©), registered (®), or similar legal or special symbols; the AI prompt MUST include an explicit instruction to omit these symbols and to return clean, trimmed name values.

#### Scenario: Successful mapping from raw composition text
- **WHEN** raw scraped composition text is provided to the AI mapper
- **THEN** the mapper output includes canonical keys needed by the exporter for core nutrients (including sugar), trace elements, and vitamins introduced in the sheet schema

#### Scenario: Sugar field included in AI prompt schema
- **WHEN** the AI mapper builds the prompt schema template
- **THEN** the `sugar` field appears in the `nutritionData` section with unit annotation `g/100g`

#### Scenario: Sugar value extracted when present in source text
- **WHEN** raw composition text contains sugar content information
- **THEN** the AI mapper returns the numeric sugar value in the `nutritionData.sugar` field

#### Scenario: Sugar value is null when absent from source text
- **WHEN** raw composition text does not contain sugar content information
- **THEN** the AI mapper returns `null` for the `nutritionData.sugar` field

#### Scenario: Mapper compatibility is maintained for renamed targets
- **WHEN** the target Google Sheets schema renames one or more destination columns
- **THEN** the mapping pipeline continues to provide canonical values that can be deterministically resolved to those renamed columns without schema-breaking key ambiguity

#### Scenario: Product name contains trademark symbol in source text
- **WHEN** the raw scraped product name contains a trademark symbol such as ™, ©, or ®
- **THEN** the AI mapper MUST return the product name without that symbol and with no extra surrounding whitespace

#### Scenario: Brand name contains trademark symbol in source text
- **WHEN** the raw scraped brand name contains a trademark symbol such as ™, ©, or ®
- **THEN** the AI mapper MUST return the brand name without that symbol and with no extra surrounding whitespace

#### Scenario: Product name contains no special symbols
- **WHEN** the raw scraped product name contains no trademark, copyright, or legal symbols
- **THEN** the AI mapper returns the product name unchanged
