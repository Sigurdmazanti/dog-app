## MODIFIED Requirements

### Requirement: Google Sheets export includes expanded fields
The Google Sheets appender MUST serialize output rows using the complete chronological `item_*` column contract and include all expanded composition fields in deterministic order, regardless of whether values were sourced by manual parsing or AI-assisted mapping.

#### Scenario: Export row contains all chronological schema columns
- **WHEN** a scrape result is appended to Google Sheets
- **THEN** the output row contains each configured `item_*` field in the exact chronological order defined by the target schema

#### Scenario: Renamed and newly added columns are populated when available
- **WHEN** canonical composition data includes values for renamed or newly added nutrient fields
- **THEN** the appender maps those values to their corresponding new `item_*` columns without shifting neighboring columns

#### Scenario: Null-safe export preserves positional integrity
- **WHEN** one or more expanded composition values are missing or null
- **THEN** the appender emits explicit empty/null-safe cells for those positions and preserves deterministic column alignment across the full row
