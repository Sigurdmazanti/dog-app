## Why

The Google Sheets target schema for scraped product composition exports has been renamed and expanded, so the current scraper output no longer aligns with the live sheet columns. Updating now prevents append failures, missing nutrient fields, and misaligned values caused by header drift.

## What Changes

- Update the Google Sheets append layer to use the new chronological `item_*` column names and order.
- Extend field mapping so all newly introduced nutrient, trace element, and vitamin columns are populated when source data is available.
- Keep deterministic export behavior when values are missing by emitting explicit empty values in the exact target column position.
- Align any helper mappers and composition key maps used by the scraper pipeline with the renamed columns and units.
- Validate row construction against the full new schema to prevent shifted columns during append operations.

## Capabilities

### New Capabilities
- `google-sheets-column-schema-alignment`: Support exporting to the new chronological Google Sheets schema with complete `item_*` headers and stable ordering.

### Modified Capabilities
- `scraped-product-composition-export`: Update export requirements to match renamed and expanded Google Sheets columns.
- `ai-product-composition-mapping`: Ensure AI-normalized composition fields map correctly into the expanded export schema.

## Impact

- Affected code is primarily in `scraper/src/helpers/googleSheetsAppender.ts`, composition key maps, and related value mappers used for sheet export.
- No Supabase schema, auth flow, or mobile runtime behavior changes are expected.
- No EAS rebuild is required; this is scraper-side behavior and can be shipped via code deployment/runtime execution changes only.
