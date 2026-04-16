## Context

`scraper/sources/bluebuffalo.yaml` was scaffolded during the `bluebuffalo-scraper` change with empty product lists. The scraper implementation and selector reference are already complete. The only missing piece is the actual product URLs.

The URLs were gathered manually by browsing `bluebuffalo.com` product catalogue pages and cover five food-type categories: dry, wet, treats, barf (fresh/raw), and misc (toppers/supplements).

## Goals / Non-Goals

**Goals:**
- Populate all five product lists in `bluebuffalo.yaml` with verified product page URLs
- Update `productCounts` totals to match the actual list lengths

**Non-Goals:**
- Validating URL reachability at this stage
- Scraping or extracting data — that comes after this change lands
- Adding new food-type categories not already in the YAML schema

## Decisions

**Flat URL list per category, no metadata**
Each entry is a bare URL string. The scraper derives all metadata (title, ingredients, analysis) by fetching and parsing the page at run time. Adding name/brand annotations to the YAML at this stage would duplicate data and create a maintenance burden.

**`freeze-dried` left empty**
No Blue Buffalo freeze-dried products were identified in the current catalogue. The key is retained in the YAML (as `[]`) to match the schema and allow future additions without a schema change.

## Risks / Trade-offs

- [URLs may go stale] → Product pages are restructured or removed over time. Mitigation: scraper run failures will surface dead links; re-scraping the catalogue periodically keeps the list fresh.
- [Incomplete catalogue] → The URL lists were assembled manually; some products may be missing. Mitigation: the lists can be extended in a follow-up change without any code changes.
