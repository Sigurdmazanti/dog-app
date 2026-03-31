## MODIFIED Requirements

### Requirement: AI mapper returns canonical composition schema
The scraper MUST produce AI-mapped composition output that remains compatible with the canonical export schema used by the Google Sheets appender, including the `sugar` field in `nutritionData` required to populate the `item_sugar_g_per_100g` column.

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
