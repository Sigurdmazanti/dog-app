## Context

The Belcando website (`belcando.com`) updated its product detail page HTML so that the product name is now rendered in two separate elements within a `.product-detail-name-container` wrapper:

- `span.product-detail-name-manufacturer` — the brand/line sub-label (e.g. "Vetline")
- `h1.product-detail-name` — the product name (e.g. "Weight Control")

Previously, a single `h1[itemprop="name"]` held the full title. The current `extractTitle` selector in `belcando.ts` only reads the `h1`, producing partial titles.

## Goals / Non-Goals

**Goals:**
- Update `extractTitle` in `belcando.ts` to concatenate the manufacturer span and the product name `h1` into a single trimmed string
- Update `belcando.selectors.md` HTML example and Selectors table to reflect the new structure

**Non-Goals:**
- Changes to composition extraction, analytical constituents, or additives logic
- Changes to source YAML, source registry, or any other scraper

## Decisions

### Concatenation approach

Combine `$('.product-detail-name-manufacturer').first().text().trim()` and `$('h1.product-detail-name').first().text().trim()`, filter out empty parts, and join with a single space. This handles the case where the manufacturer span may be absent on some products without requiring a fallback branch — `filter(Boolean)` on the array removes empty strings naturally.

**Alternative considered**: continue targeting `h1[itemprop="name"]` with the updated selector `h1.product-detail-name[itemprop="name"]`. Rejected because it still misses the manufacturer sub-label.

## Risks / Trade-offs

- [Partial page structure] Some older Belcando products may still use the old single-`h1` structure → the manufacturer span selector will return an empty string and the join produces just the `h1` text, which is acceptable.
- [Double-space if only manufacturer text] Mitigated by the `filter(Boolean)` join approach — only non-empty parts are joined.
