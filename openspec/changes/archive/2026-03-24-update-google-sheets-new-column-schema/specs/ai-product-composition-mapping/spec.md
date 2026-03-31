## MODIFIED Requirements

### Requirement: AI mapper returns canonical composition schema
The scraper MUST produce AI-mapped composition output that remains compatible with the canonical export schema used by the Google Sheets appender, including fields required to populate the expanded chronological `item_*` columns.

#### Scenario: Successful mapping covers expanded export fields
- **WHEN** cleaned scraped composition data is provided to the AI mapper
- **THEN** the mapper output includes canonical keys needed by the exporter for core nutrients, trace elements, and vitamins introduced in the new sheet schema

#### Scenario: Mapper compatibility is maintained for renamed targets
- **WHEN** the target Google Sheets schema renames one or more destination columns
- **THEN** the mapping pipeline continues to provide canonical values that can be deterministically resolved to those renamed columns without schema-breaking key ambiguity
