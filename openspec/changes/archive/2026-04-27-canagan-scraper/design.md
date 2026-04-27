## Context

The scraper project extracts dog food nutritional data from brand websites using Cheerio-based per-source scrapers. Each scraper is registered in `sourceRegistry.ts` and dispatched by domain match. Canagan's product pages at `canagan.com` use a distinct HTML structure: the product title is split across multiple `<div>` elements inside `h1.product-name`, where the middle `<div>` holds the actual product name and the outer divs hold category labels (e.g. "Dry Dog Food", "For Adults"). Nutritional data is inside a `div.pd-region` containing `<h4>` headings followed by `<p>` tags.

## Goals / Non-Goals

**Goals:**
- Implement `scraper/src/scrapers/canagan.ts` following the existing `runScraper` pattern
- Extract product name from the second `<div>` inside `h1.product-name` only
- Extract composition from the `<p>` following `<h4>COMPOSITION</h4>` within `div.pd-region`
- Extract analytical constituents and additives from their respective `<h4>` sections
- Register `canagan.com` in `sourceRegistry.ts`
- Provide `canagan.yaml` with all 56 product URLs (18 dry, 19 wet, 15 treats, 2 freeze-dried toppers) and matching `productCounts`
- Provide `canagan.selectors.md` documenting the HTML structure and selectors

**Non-Goals:**
- Scraping non-dog products or non-UK Canagan variants
- Extracting feeding guide or pack size data
- Pagination or category-page crawling (URLs are supplied explicitly)

## Decisions

### Title: Extract second `<div>` of `h1.product-name` only
**Decision:** Use `$('h1.product-name div').eq(1).text().trim()` to get the product name (the middle div, 0-indexed as index 1).

**Rationale:** The first and third divs contain category labels like "Dry Dog Food" and "For Adults". The second div always contains the actual product variant name (e.g. "Small Breed Light / Senior"). This mirrors user requirement to exclude type/category text.

**Alternative considered:** Strip known strings like "Dry Dog Food" from the full h1 text — rejected as fragile given variable category label wording.

### Nutritional sections: `<h4>` + next `<p>` within `div.pd-region`
**Decision:** Iterate `div.pd-region h4` elements by trimmed text, then take the next sibling `<p>`.

**Rationale:** Canagan's markup uses `<h4>` headings (`COMPOSITION`, `ANALYTICAL CONSTITUENTS`, `NUTRITIONAL ADDITIVES (PER KG)`) inside a `div.pd-region`. This matches the pattern used for `<h5>` headings in Bozita — same traversal approach, different selector.

**Alternative considered:** CSS attribute selectors — not applicable since headings have no unique attributes.

### `extractCompositionText` combines analytical constituents + additives
**Decision:** Concatenate ANALYTICAL CONSTITUENTS and NUTRITIONAL ADDITIVES (PER KG) paragraphs with a newline, filtering empty strings, matching the Bozita pattern.

**Rationale:** Downstream processing expects a single `compositionText` field containing both analytical and additive data.

## Risks / Trade-offs

- **Site markup changes** → Mitigation: selector reference doc makes future debugging straightforward; selectors are intentionally minimal.
- **Title extraction brittleness if div count changes** → Mitigation: `eq(1)` is simple and will produce an empty string (not an error) if the structure changes, making failures visible.
- **freeze-dried toppers appear in both `treats` and a separate `freeze-dried` category in the URL list** — the two freeze-dried toppers overlap with the treats list. The YAML will use a `toppers` key to avoid duplication; product count for `treats` will not double-count them.
