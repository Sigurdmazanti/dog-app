## MODIFIED Requirements

### Requirement: Fallback-safe scrape output
The scraping pipeline MUST emit structurally stable outputs for the expanded composition fields even when one or more source values are absent or when AI-based mapping fails validation.

#### Scenario: Missing value does not break output shape
- **WHEN** a product page omits one or more expanded composition attributes
- **THEN** the resulting scrape payload still includes all expected fields with fallback-safe defaults

#### Scenario: AI mapping failure preserves stable shape
- **WHEN** the AI mapper returns invalid JSON, schema-invalid data, or times out
- **THEN** the resulting scrape payload still includes all expected fields with fallback-safe defaults and no structural regression

### Requirement: Google Sheets export includes expanded fields
The Google Sheets appender MUST include the expanded composition fields in row serialization and preserve deterministic column order, regardless of whether values were sourced by manual parsing or AI-assisted mapping.

#### Scenario: Export row contains new composition columns
- **WHEN** a scrape result with expanded composition data is appended
- **THEN** the output row contains each new composition value in the intended column positions

#### Scenario: Null-safe export from AI-assisted mapping
- **WHEN** AI-assisted mapping returns null for one or more composition values
- **THEN** the Google Sheets row preserves deterministic column positions and appends null-safe values without shifting columns