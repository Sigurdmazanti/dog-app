## MODIFIED Requirements

### Requirement: AI mapper returns canonical composition schema
The scraper MUST produce AI-mapped composition output that remains compatible with the canonical export schema used by the Google Sheets appender, including fields required to populate the expanded chronological `item_*` columns.

#### Scenario: Successful mapping from raw composition text
- **WHEN** raw scraped composition text is provided to the AI mapper
- **THEN** the mapper output includes canonical keys needed by the exporter for core nutrients, trace elements, and vitamins introduced in the sheet schema

#### Scenario: Mapper compatibility is maintained for renamed targets
- **WHEN** the target Google Sheets schema renames one or more destination columns
- **THEN** the mapping pipeline continues to provide canonical values that can be deterministically resolved to those renamed columns without schema-breaking key ambiguity

### Requirement: Mapper output is validated before pipeline use
The scraper MUST validate AI mapper responses before merging them into scrape results, including text-derived responses.

#### Scenario: Invalid JSON or schema mismatch from text input
- **WHEN** the AI response is non-JSON or violates the canonical schema contract for a text-based mapping request
- **THEN** the pipeline rejects that response and uses fallback-safe mapped output instead of failing the entire scrape process
