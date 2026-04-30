## Context

The scraper supports multiple dog food brands via a shared `runScraper` helper that accepts three extraction callbacks: `extractTitle`, `extractIngredientsDescription`, and `extractCompositionText`.

Cavom product pages (cavom.com) are WordPress/WooCommerce-based. The product title sits in `h1.entry-title.product_title`. Product information is presented as a series of expandable tabs rendered as `div.m-productTab` blocks. Each tab has a heading inside `.m-productTab__title h2` (e.g. "Description", "Composition", "Nutritional advice") and content inside `.m-productTab__text`. The Composition tab contains three sub-sections delimited by `<p><strong>...</strong></p>` headings: "Composition", "Analytical Constituents", and "Nutritional Additives", each followed by one or more `<p>` paragraphs holding the values.

## Goals / Non-Goals

**Goals:**
- Add `scrapeCavom` using the existing `runScraper` helper
- Map `cavom.com` to the new scraper in `sourceRegistry.ts`
- Add `cavom.json` source file containing the supplied dry product URLs

**Non-Goals:**
- No changes to the `runScraper` helper or scraper architecture
- No discovery/listing crawler — the `discovery` block is left empty per the standard new-scraper workflow
- No handling of non-English product page variants (Dutch pages are out of scope unless specifically supplied)

## Decisions

### Decision: Locate the Composition tab by its `<h2>` heading text
The page renders multiple `div.m-productTab` blocks (Description, Composition, Nutritional advice). Each tab's heading is in `.m-productTab__title h2`. The scraper SHALL iterate `div.m-productTab` and select the one whose `h2` text equals "Composition" (case-insensitive). This is more stable than relying on the `-active` modifier class, which reflects UI state and is not guaranteed.

### Decision: Split the Composition tab content by `<strong>` sub-headings
Inside `.m-productTab__text`, sub-sections are introduced by `<p><strong>HEADING</strong></p>` followed by one or more `<p>` paragraphs containing the values. The scraper SHALL walk the children of `.m-productTab__text`, treat any element whose entire trimmed text equals the contained `<strong>` text as a heading marker, and accumulate subsequent paragraph text until the next heading marker. This yields three logical sections: "Composition", "Analytical Constituents", and "Nutritional Additives".

### Decision: Map sections to extractor outputs
- `extractIngredientsDescription` returns the "Composition" section text (the ingredient list).
- `extractCompositionText` returns the "Analytical Constituents" section concatenated with the "Nutritional Additives" section, joined by newline. The ingredients description is intentionally not included here because the existing AI mapping pipeline already receives the ingredients description separately and composition text is reserved for analytical/additive values.

### Decision: Keep `discovery` empty
Per the project convention for new scrapers, `discovery.listings` and `discovery.productLinkSelector` are left empty. Only the user-supplied `products.dry` URLs are populated; automated discovery can be added later.

## Risks / Trade-offs

- [Risk] Sub-section headings inside the Composition tab might appear in a non-English variant (e.g. "Samenstelling"). → Mitigation: Only the supplied English URLs are in scope; if Dutch URLs are added later, the heading matcher can be extended to alternate spellings.
- [Risk] WordPress markup may collapse `<p>` boundaries in the source HTML (the example markup has unclosed `<p>` tags). → Mitigation: Cheerio normalises HTML during parsing, so `.children()` reliably yields the paragraphs as siblings of the heading paragraphs.
- [Risk] A future tab named "Composition" may be added (e.g. "Composition (Old)"). → Mitigation: Strict equality against `"composition"` (case-insensitive) prevents accidental matches; can be revisited if the site changes.
