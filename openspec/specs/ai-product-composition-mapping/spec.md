## ADDED Requirements

### Requirement: AI mapper returns canonical composition schema
The scraper MUST produce AI-mapped composition output that remains compatible with the canonical export schema used by the Google Sheets appender, including fields required to populate the expanded chronological `item_*` columns.

#### Scenario: Successful mapping from raw composition text
- **WHEN** raw scraped composition text is provided to the AI mapper
- **THEN** the mapper output includes canonical keys needed by the exporter for core nutrients, trace elements, and vitamins introduced in the sheet schema

#### Scenario: Mapper compatibility is maintained for renamed targets
- **WHEN** the target Google Sheets schema renames one or more destination columns
- **THEN** the mapping pipeline continues to provide canonical values that can be deterministically resolved to those renamed columns without schema-breaking key ambiguity

### Requirement: Missing values are explicit and non-inferred
The mapper MUST return null for fields that are absent or not confidently extractable and MUST NOT guess values.

#### Scenario: Source omits composition values
- **WHEN** one or more canonical nutrients are not present in the cleaned input
- **THEN** the corresponding fields are set to null in the mapped output

### Requirement: Percentage values are normalized to numeric representation
The mapper MUST normalize percentage-formatted values to numeric form in the canonical schema.

#### Scenario: Percentage token in source text
- **WHEN** a value is expressed as a percentage such as 29%
- **THEN** the mapped output stores the value as the number 29 for the corresponding per-100g field

### Requirement: Mapper output is validated before pipeline use
The scraper MUST validate AI mapper responses before merging them into scrape results, including text-derived responses.

#### Scenario: Invalid JSON or schema mismatch from text input
- **WHEN** the AI response is non-JSON or violates the canonical schema contract for a text-based mapping request
- **THEN** the pipeline rejects that response and uses fallback-safe mapped output instead of failing the entire scrape process

### Requirement: Mapping behavior is deterministic across app platforms
The mapping contract MUST produce platform-independent structured outputs so iOS and Android clients observe the same resulting composition values from shared data.

#### Scenario: Same source input consumed by different clients
- **WHEN** one scrape result is later viewed on iOS and Android
- **THEN** both clients receive identical canonical composition field values produced by the mapping pipeline