## Why

Scraped product composition data is currently mapped through manual extraction logic, which is slow to evolve and brittle when source label formats vary. Introducing an AI-assisted mapper now reduces maintenance overhead and improves resilience while preserving the existing output schema used by downstream export workflows.

## What Changes

- Add an AI-assisted structured mapping step that converts cleaned scraped composition text into the existing canonical product composition schema.
- Define strict extraction rules for the mapper: return JSON only, use null for missing values, avoid guessing, and normalize percentage values to numeric fields.
- Add response validation and fallback behavior so scraper output remains structurally stable when the AI response is incomplete or invalid.
- Integrate the mapper into the scraper pipeline before export serialization while preserving current row shape expectations.
- Document configuration and operational constraints for model usage, API key setup, retry/error handling, and cost-aware model selection.

## Capabilities

### New Capabilities
- ai-product-composition-mapping: Uses an LLM prompt contract to map cleaned scrape data into the canonical composition schema with deterministic post-parse validation.

### Modified Capabilities
- scraped-product-composition-export: Changes requirements so composition fields may be sourced from the AI mapping stage while preserving existing structural guarantees and export compatibility.

## Impact

- Affected system: scraper ingestion and normalization flow in the scraper workspace.
- Affected interfaces: product composition mapping contracts and scrape result population behavior.
- Dependencies/config: OpenAI client usage and required runtime API key configuration.
- Operational impact: no iOS or Android native behavior change, no EAS build requirement; server-side/data-pipeline only.
- Risk area: output correctness and schema stability for Google Sheets append compatibility.