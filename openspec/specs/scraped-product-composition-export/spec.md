## ADDED Requirements

### Requirement: Expanded composition model coverage
The scraper domain model MUST define typed fields for the requested composition groups: minerals, salts, vitamins (including B1/B2/B3/B5/B6/B7/B9/B12), amino-acid derivatives, vitamin-like compounds, fatty acids, and sugar alcohols.

#### Scenario: Typed groups are present in contracts
- **WHEN** developers inspect product composition and scrape result interfaces
- **THEN** each requested group and field has an explicit typed property available for parsing and export

### Requirement: Alias-based canonical key mapping
The extraction key map MUST normalize source labels using canonical-first alias mapping, where the first configured label is canonical and all subsequent slash-listed labels resolve to that same field.

#### Scenario: Synonym labels resolve to one field
- **WHEN** a page uses any configured alias for a nutrient or additive
- **THEN** the parser stores the value under the canonical field key without creating duplicate keys

### Requirement: Fallback-safe scrape output
The scraping pipeline MUST emit structurally stable outputs for the expanded composition fields even when one or more source values are absent or when AI-based mapping fails validation.

#### Scenario: Missing value does not break output shape
- **WHEN** a product page omits one or more expanded composition attributes
- **THEN** the resulting scrape payload still includes all expected fields with fallback-safe defaults

#### Scenario: AI mapping failure preserves stable shape
- **WHEN** the AI mapper returns invalid JSON, schema-invalid data, or times out
- **THEN** the resulting scrape payload still includes all expected fields with fallback-safe defaults and no structural regression

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

### Requirement: Backward compatibility for existing scraper flow
The expanded composition extraction MUST preserve existing successful scrape behavior for previously supported fields and row appends.

#### Scenario: Legacy fields remain populated
- **WHEN** scraping a product that only contains previously supported composition attributes
- **THEN** legacy fields continue to be parsed and exported without regression
