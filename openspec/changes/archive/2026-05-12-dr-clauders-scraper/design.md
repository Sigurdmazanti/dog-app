## Context

The scraper project already has a `runScraper` helper and a `sourceRegistry` that dispatches product URLs to brand-specific scrapers. Dr. Clauder's (`dr-clauder.com`) exposes product detail pages with a tabbed layout where the composition tab (`#composition-content`) contains the ingredients list, analytical constituents, and additives all in a single `<p>` block. The listing pages support pagination via `.pagination > .next > a`.

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description, and analytical constituents from `dr-clauder.com` product pages
- Register `dr-clauder.com` in the source registry
- Provide a source JSON scaffold with food-type buckets (`dry`, `wet`, `treats`, `misc`) and discovery config
- Document selectors in a `.selectors.md` reference

**Non-Goals:**
- Populating product URLs (supplied by the user separately)
- Scraping pages other than the `/en/` language variant

## Decisions

### Title extraction
Use `$('h1.product-detail__title').text().trim()`. The title element is unambiguous in the markup.

### Composition content extraction
All relevant data (ingredients, analytical constituents, additives) lives inside a single element: `#composition-content`. Rather than attempting regex-based splitting in the scraper itself, the full trimmed text of `#composition-content` is passed as `compositionText` to the AI mapper, which handles section parsing. For `ingredientsDescription`, the same `#composition-content` text is returned (the AI mapper may override it via `ingredientsDescriptionEnglish`).

**Alternative considered:** Splitting on `<strong>` tags to isolate the "Composition" paragraph from the "Analytical Constituents" paragraph. Rejected as brittle — the structure may vary across product lines; letting the AI mapper handle the split is more robust.

### Discovery / pagination
Per-food-type listing URLs are used (e.g. `?filter.p.m.custom.futterart=dry+food`) so pagination applies only to the relevant product set. `maxPages` is set conservatively to `8` to cover the largest food-type listing (treats, ~7 pages) with one page of headroom.

## Risks / Trade-offs

- **Single content block**: Because composition and analytical constituents share `#composition-content`, if the AI mapper misidentifies section boundaries the output will be wrong. Mitigation: test with several product URLs across categories before bulk-scraping.
- **Language variant**: The `/en/` URL path returns English-language pages. If a URL lacking `/en/` is passed, content will be German. Mitigation: source JSON and documentation should note the `/en/` requirement; the registry matches the full domain only, not the path.
- **Pagination cap**: `maxPages: 8` may under-count if a category grows beyond 8 pages. Mitigation: the value is in the source JSON and can be adjusted without code changes.
