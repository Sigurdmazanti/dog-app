## MODIFIED Requirements

### Requirement: Google Sheets export includes expanded fields
The Google Sheets appender MUST serialize output rows using the complete chronological `item_*` column contract and include all expanded composition fields in deterministic order, regardless of whether values were sourced by manual parsing or AI-assisted mapping. In batch mode, each successfully scraped result MUST be appended individually, and a single row failure MUST NOT prevent subsequent rows from being appended.

#### Scenario: Export row contains all chronological schema columns
- **WHEN** a scrape result is appended to Google Sheets
- **THEN** the output row contains each configured `item_*` field in the exact chronological order defined by the target schema, including `item_sugar_g_per_100g`

#### Scenario: Sugar column is populated when available
- **WHEN** canonical composition data includes a sugar value
- **THEN** the appender maps the `sugar` field from `nutritionData` to the `item_sugar_g_per_100g` column

#### Scenario: Null-safe export preserves positional integrity
- **WHEN** the sugar value is missing or null
- **THEN** the appender emits an explicit empty/null-safe cell for the sugar position and preserves deterministic column alignment across the full row

#### Scenario: Batch append handles partial failures
- **WHEN** a batch of scrape results is being appended to Google Sheets and one append call fails
- **THEN** the system logs the failure for that row and continues appending subsequent rows without aborting
