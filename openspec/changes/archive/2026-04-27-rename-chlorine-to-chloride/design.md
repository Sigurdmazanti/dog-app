## Context

The scraper pipeline uses "chlorine" as the internal field name for the Cl⁻ mineral throughout `MineralsData`, `mineralsKeyMap`, `aiProductCompositionMapper`, and the Google Sheets export schema. The scientifically correct term for the measured ion is "chloride". The Google Sheets column has been renamed externally to `item_chloride_mg_per_100g`, creating a mismatch between the outgoing column header and the actual column in the destination sheet.

## Goals / Non-Goals

**Goals:**
- Rename every internal `chlorine` identifier to `chloride` so the codebase is internally consistent and matches the external Google Sheets column name
- Ensure the Google Sheets schema constant and column resolver both emit `item_chloride_mg_per_100g`

**Non-Goals:**
- Changing the alias list in `mineralsKeyMap` — the existing aliases (`'chlorine'`, `'chloride'`, `'chlorid'`, `'klor'`, `'cl'`, `'cl-'`, `'cl⁻'`) already cover all product-page label variants and must remain unchanged
- Any changes to scraper source YAML/selector files — they do not reference the field name directly
- Changes to database schema or Supabase tables

## Decisions

### Rename the TypeScript field in `MineralsData`
Rename `chlorine: number` → `chloride: number` in the `MineralsData` interface.

**Why:** The interface is the single source of truth for composition field names. Renaming here propagates the correct term everywhere via TypeScript's type system and enables the compiler to catch every missed reference.

**Alternative considered:** Add a `chloride` alias alongside `chlorine` and deprecate the old field. Rejected — this is a pure rename with no external callers outside this repo; a clean rename is simpler and avoids drift.

### Update all consumers atomically
All four affected files (`productComposition.ts`, `productCompositionKeyMap.ts`, `aiProductCompositionMapper.ts`, `googleSheetsAppender.ts`) must be updated in a single change so there is no intermediate state where TypeScript types are broken.

### Preserve the alias list unchanged
The `mineralsKeyMap` value array `['chlorine', 'chloride', 'chlorid', 'klor', 'cl', 'cl-', 'cl⁻']` must not be modified. Product pages may use either "chlorine" or "chloride" as a label; both must continue to resolve to the `chloride` field.

## Risks / Trade-offs

- [Risk] Any future code that accesses `mineralsData.chlorine` will produce a TypeScript compile error → Mitigation: TypeScript will surface every missed reference at build time; no runtime risk.
- [Risk] Google Sheets column name mismatch until this change is deployed → Mitigation: The column rename is already live in the sheet; this change resolves the mismatch and is low risk to deploy.
