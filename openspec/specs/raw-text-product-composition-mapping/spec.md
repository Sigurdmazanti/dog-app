## ADDED Requirements

### Requirement: Mapper SHALL accept raw composition text input
The product composition mapper MUST accept unstructured source text as input and produce canonical composition sections without requiring a pre-parsed nutrient row array.

#### Scenario: Raw text provided from scraper page content
- **WHEN** a scraper passes the full composition text block from a product page
- **THEN** the mapper processes that text directly and returns canonical composition sections

#### Scenario: No local key-value pre-parsing
- **WHEN** raw composition text is passed to the mapper
- **THEN** the mapper sends raw text directly to AI extraction logic and does not transform the text into local key-value nutrient entries before mapping

### Requirement: Mapper SHALL extract nutrient values from prose patterns
The mapper MUST extract nutrient-relevant values embedded in prose, including percentages, mass units (g, mg, ug), IU values, and energy statements where present.

#### Scenario: Mixed prose includes percentages and additive quantities
- **WHEN** source text contains values such as 29%, 121mg, and 115 IU in narrative form
- **THEN** the mapper returns normalized numeric values in the corresponding canonical fields or null when no reliable mapping exists

### Requirement: Mapper SHALL preserve canonical schema compatibility
The mapper MUST return the same top-level section structure and canonical field naming contract used by downstream exporter and sheet append logic.

#### Scenario: Downstream exporter consumes mapped output
- **WHEN** raw-text mapping output is passed to existing export code
- **THEN** no schema adaptation is required to append values to the expected canonical targets

### Requirement: Mapper SHALL fail safely with fallback behavior
If AI extraction from raw text fails, times out, or returns invalid schema data, the pipeline MUST provide fallback-safe output and continue scrape execution.

#### Scenario: AI response is invalid for text-derived mapping
- **WHEN** the AI output cannot be parsed or validated against the canonical schema
- **THEN** the mapper returns empty canonical sections and includes failure notes without crashing the scrape job
