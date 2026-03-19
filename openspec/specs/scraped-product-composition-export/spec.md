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
The scraping pipeline MUST emit structurally stable outputs for the expanded composition fields even when one or more source values are absent.

#### Scenario: Missing value does not break output shape
- **WHEN** a product page omits one or more expanded composition attributes
- **THEN** the resulting scrape payload still includes all expected fields with fallback-safe defaults

### Requirement: Google Sheets export includes expanded fields
The Google Sheets appender MUST include the expanded composition fields in row serialization and preserve deterministic column order.

#### Scenario: Export row contains new composition columns
- **WHEN** a scrape result with expanded composition data is appended
- **THEN** the output row contains each new composition value in the intended column positions

### Requirement: Backward compatibility for existing scraper flow
The expanded composition extraction MUST preserve existing successful scrape behavior for previously supported fields and row appends.

#### Scenario: Legacy fields remain populated
- **WHEN** scraping a product that only contains previously supported composition attributes
- **THEN** legacy fields continue to be parsed and exported without regression
