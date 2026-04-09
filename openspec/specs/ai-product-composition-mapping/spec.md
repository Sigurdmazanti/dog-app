## Purpose

Define how the AI-powered composition mapper extracts, validates, and normalizes nutritional data from raw product text into the canonical schema used by the export pipeline.

## Requirements

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

### Requirement: AI request timeout is enforced
The AI composition mapper SHALL enforce a maximum duration on each OpenAI API call. Calls that exceed the timeout SHALL be treated as failures and trigger the retry loop.

#### Scenario: AI call exceeds timeout
- **WHEN** the OpenAI API does not respond within the configured timeout duration
- **THEN** the in-flight call SHALL be aborted and the mapper SHALL proceed to the next retry attempt (or return the fallback-safe output if retries are exhausted)

#### Scenario: AI call completes within timeout
- **WHEN** the OpenAI API responds before the configured timeout
- **THEN** the response SHALL be processed normally with no timeout-related side effects

### Requirement: AI request timeout is configurable with a documented default
The timeout for AI API calls SHALL default to **60 000 ms (60 seconds)** and SHALL be overridable via the `OPENAI_TIMEOUT_MS` environment variable so operators can tune it without code changes.

#### Scenario: Default timeout applied when env var is absent
- **WHEN** `OPENAI_TIMEOUT_MS` is not set in the environment
- **THEN** the mapper SHALL use a 60 000 ms timeout for each AI API call

#### Scenario: Custom timeout applied when env var is set
- **WHEN** `OPENAI_TIMEOUT_MS` is set to `30000`
- **THEN** the mapper SHALL use a 30 000 ms timeout for each AI API call