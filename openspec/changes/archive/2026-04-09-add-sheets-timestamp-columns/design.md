## Context

The scraper exports product composition data to Google Sheets via `googleSheetsAppender.ts`. The schema is defined as a `const` array (`GOOGLE_SHEETS_SCHEMA`) and a parallel resolver map (`createColumnResolvers`). Currently:

- `item_data_source` is always written as an empty string, even though the scraper already resolves the source via `findSource(url)` in `scraper.ts`
- There are no timestamp columns — neither `item_created_at` nor `item_updated_at` — so rows arriving in Supabase carry no creation metadata

The appender receives a `ScrapeDataRow` (extends `ScrapeResult`) which does not currently carry a `dataSource` field.

## Goals / Non-Goals

**Goals:**
- Append `item_created_at` and `item_updated_at` to the tail of `GOOGLE_SHEETS_SCHEMA` (after `item_note`)
- Populate both as ISO 8601 strings localised to `Europe/Copenhagen`, compatible with PostgreSQL `timestamptz`
- Populate `item_data_source` with the resolved `SourceEntry.domain` string (e.g. `'zooplus'`, `'emea.acana'`)
- Keep the schema deterministic and the row width unchanged at a single authoritative constant

**Non-Goals:**
- Adding timezone conversion utilities beyond what is needed for the Copenhagen locale
- Supabase schema migrations or direct DB writes
- Any changes to the Google Sheets header row (caller's responsibility)
- Changing how `item_created_at` and `item_updated_at` differ from each other — both are set to scrape time

## Decisions

### 1. Timestamp format: offset-based ISO 8601 string

**Decision:** Emit timestamps as `"YYYY-MM-DDTHH:mm:ss+HH:MM"` strings using `Intl.DateTimeFormat` with `timeZone: 'Europe/Copenhagen'` to assemble parts, then format manually into ISO 8601 with the correct UTC offset.

**Rationale:** PostgreSQL `timestamptz` accepts ISO 8601 strings with UTC offset directly. Using `Intl.DateTimeFormat` with `formatToParts` gives correct DST-aware Copenhagen-local time without requiring a date library. No new dependency needed.

**Alternative considered:** `date-fns-tz` — rejected to avoid a new runtime dependency for a one-liner concern.

**Alternative considered:** Emitting UTC and relying on DB timezone setting — rejected because the user explicitly wants Copenhagen-local display in the sheet itself.

**Format note:** `item_created_at` and `item_updated_at` are both captured at scrape start time and will be identical values on initial creation. Update semantics are deferred to the Supabase layer.

### 2. dataSource propagation: extend ScrapeDataRow

**Decision:** Add a `dataSource: string` field to `ScrapeDataRow` in `scrapeResult.ts`. Populate it in `scraper.ts` where `findSource(url)` is already called. The appender reads it from `dataRow.dataSource`.

**Rationale:** The appender already receives `ScrapeDataRow` and should remain stateless with respect to source resolution. Passing `dataSource` via the row keeps the appender dependency-free from `sourceRegistry` — consistent with the existing pattern where `foodType` and `noteText` are attached at the scraper layer.

**Alternative considered:** Import `findSource` directly into the appender — rejected because it creates a new coupling between the appender and the registry, and the URL is already resolved in `scraper.ts`.

### 3. Schema tail placement

**Decision:** Append `item_created_at` then `item_updated_at` as the last two entries after `item_note`.

**Rationale:** Existing columns in the sheet are header-matched (not positional), so adding tail columns is non-breaking for existing rows. The spec for `google-sheets-column-schema-alignment` already mandates a fixed-length row; `EXPECTED_GOOGLE_SHEETS_COLUMN_COUNT` will automatically update via `GOOGLE_SHEETS_SCHEMA.length`.

## Risks / Trade-offs

- **DST transitions** → `Intl.DateTimeFormat` with `timeZone: 'Europe/Copenhagen'` is DST-aware and will correctly emit `+02:00` in summer and `+01:00` in winter. No mitigation needed beyond using this API.
- **Existing sheet rows shorter than the new schema** → Pre-existing rows will have empty cells in the two new columns; this is expected and acceptable for Google Sheets. No migration of existing data is required.
- **`dataSource` empty on direct `buildGoogleSheetsRow` calls without going through `scrapeUrl`** → Any caller constructing a `ScrapeDataRow` manually must supply `dataSource: ''` (or a real value). TypeScript will enforce this after the interface change.
