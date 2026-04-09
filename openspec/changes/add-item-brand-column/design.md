## Context

The scraper pipeline currently exports product rows to Google Sheets with a `item_data_source` column populated from `SourceEntry.domain` (e.g. `"www.acana.com"`, `"zooplus"`). This is a URL fragment — suitable as a technical identifier but not a clean brand label for end-users filtering or grouping data. Brand information is entirely absent from the data model.

The pipeline data flow is: individual scrapers → `ScrapeResult` → `scraper.ts` enrichment → `ScrapeDataRow` → `googleSheetsAppender.ts` → Google Sheets row array. Brand can be introduced at the `SourceEntry` level and flow through without touching individual scraper logic.

## Goals / Non-Goals

**Goals:**
- Add `brand: string` to `SourceEntry` so brand is declared once per registered source
- Propagate brand through `ScrapeDataRow` and into the Google Sheets export as `item_brand`
- Populate brand values for all currently registered scraper sources

**Non-Goals:**
- Scraping brand dynamically from product pages (brand comes from the registry, not the HTML)
- Changing the position of existing columns in the sheet schema
- Adding brand to the mobile app UI

## Decisions

### Brand is a registry-level field, not a per-scrape extraction

**Decision:** `brand` lives on `SourceEntry` in `sourceRegistry.ts`, not on `ScrapeResult`.

**Rationale:** Brand is a static property of the data source, not something that changes per product. Extracting it from HTML would add fragility for no benefit. Setting it once in the registry is the single source of truth. This mirrors how `domain` works for `item_data_source`.

**Alternative considered:** Add brand parsing to each individual scraper. Rejected — unnecessary complexity, prone to breakage if page structure changes, and semantically brand is source metadata not product data.

---

### `item_brand` column position: after `item_name`, before `item_url`

**Decision:** Insert `item_brand` after `item_name` (position 3), shifting `item_url` to position 4.

**Rationale:** Brand is a first-class product identifier alongside name. Grouping `item_name` / `item_brand` at the front makes the sheet visually scannable. Placing it before URL (a long value) prevents the most human-readable columns from being hidden off-screen in Sheets. 

**Alternative considered:** Append after `item_data_source` near the end. Rejected — brand is not a provenance/metadata field, it's a primary attribute.

---

### `brand` field is required on `SourceEntry` (not optional)

**Decision:** Type as `brand: string`, not `brand?: string`.

**Rationale:** Every registered source has a known brand. Making it required enforces completeness at the registry level and avoids null-handling throughout the pipeline. If a future source genuinely lacks a brand, an empty string `""` can be used explicitly.

## Risks / Trade-offs

- **Existing sheet column positions shift by 1 for `item_url` onward** → Mitigation: Sheets consumers should not rely on positional column index; they reference headers by name. The appender already builds rows by name-keyed schema, so no appender code breaks from reordering.
- **All `SourceEntry` objects must be updated immediately** → Mitigation: TypeScript will flag any entry missing `brand` as a compile error, so nothing can be missed.
