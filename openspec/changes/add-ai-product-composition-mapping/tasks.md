## 1. AI Mapping Module (scraper/src/helpers)

- [x] 1.1 Add a dedicated helper for AI-based composition mapping that accepts cleaned scraped data and returns the canonical product composition schema shape.
- [x] 1.2 Implement strict prompt contract behavior in the helper: JSON-only output, null for missing fields, no guessing, and percentage-to-number normalization.
- [x] 1.3 Add local response parsing and schema validation to reject malformed or non-conforming AI responses before pipeline use.
- [x] 1.4 Add a fallback-safe output builder that preserves full schema shape when AI mapping fails or times out.
- [x] 1.5 Verification: run a targeted scraper execution with representative inputs and confirm valid mapping, invalid-response handling, and fallback-safe output behavior.

## 2. Scraper Pipeline Integration (scraper/src/scraper.ts and related flow)

- [x] 2.1 Integrate the AI mapping helper into the existing cleaned-data to composition mapping path without changing downstream payload keys.
- [x] 2.2 Ensure pipeline behavior remains non-breaking by preserving existing scrape result structure for both populated and missing composition values.
- [x] 2.3 Add controlled error handling and logging for model/API failures so pipeline execution can continue with fallback-safe mapping.
- [x] 2.4 Verification: compare pre/post integration scrape payload shapes and confirm deterministic field presence and null-safe values.

## 3. Export Compatibility (scraper/src/helpers/googleSheetsAppender.ts)

- [x] 3.1 Confirm Google Sheets row serialization continues to read canonical composition keys produced by the AI mapping path.
- [x] 3.2 Ensure null-safe AI-mapped values do not shift or reorder spreadsheet columns.
- [x] 3.3 Verification: append rows generated from both successful AI mappings and fallback-safe mappings and confirm column order and values remain stable.

## 4. Configuration and Operations

- [x] 4.1 Add or update environment configuration requirements for AI access keys and model selection in scraper documentation.
- [x] 4.2 Add operational guardrails in code or config for timeout and retry behavior to balance cost, latency, and resilience.
- [x] 4.3 Verification: run the scraper with configuration present and missing to confirm expected behavior in both cases.