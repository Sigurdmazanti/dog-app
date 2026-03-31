## Why

The current AI product composition mapper expects pre-parsed name/value rows, but many vendor pages only expose nutrition and additive data as unstructured text blocks. This causes fragile scraper-specific parsing and missed nutrient mappings when the HTML structure differs.

## What Changes

- Replace the mapper input contract so AI mapping can consume raw composition text directly.
- Add extraction and normalization guidance for nutrient values embedded in free text (percentages, mg/ug/g values, IU, and energy lines).
- Remove local key-value pre-parsing and rely on AI-only extraction from raw text.
- Return empty canonical sections (with notes) when AI is unavailable or validation fails.
- Update scraper integration points (starting with Acana EU) to pass the raw text source instead of requiring table-like rows.
- Preserve current output schema and section structure so downstream export and sheets append logic remain stable.

## Capabilities

### New Capabilities
- `raw-text-product-composition-mapping`: Map nutrient composition from unstructured product text into the canonical composition sections.

### Modified Capabilities
- `ai-product-composition-mapping`: Change mapper input requirements from structured rows to raw text and clarify fallback/validation behavior for text-derived mappings.

## Impact

- Affected code: scraper helper mapping pipeline under scraper/src/helpers and scraper integrations under scraper/src/scrapers.
- Affected behavior: mapping reliability on pages without structured analysis tables should improve.
- API impact: mapper function signature changes for internal scraper usage.
- Dependencies: no new external dependency required; existing OpenAI client remains.
- Runtime/build: scraper-only logic change, no mobile app EAS build impact.
