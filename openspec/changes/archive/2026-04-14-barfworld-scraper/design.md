## Context

The scraper package follows a per-domain pattern: each source has a TypeScript scraper in `scraper/src/scrapers/`, a YAML product list in `scraper/sources/`, a Markdown selector reference in `scraper/sources/`, and a registry entry in `scraper/src/sourceRegistry.ts`. barfworld.com is a Shopify-based store that uses an accordion layout (`<dt>`/`<dd>` pairs) with named panels (`#panel-ingredients`, `#panel-guaranteed-analysis`) and `.metafield-rich_text_field` content containers.

## Goals / Non-Goals

**Goals:**

- Extract product title, ingredients, and guaranteed analysis from barfworld.com product pages
- Follow the established scraper pattern (runScraper helper, same file layout as existing scrapers)
- Register the scraper in sourceRegistry.ts under the `barfworld.com` domain

**Non-Goals:**

- No UI, app, or Supabase changes
- No new dependencies
- No scraping of listing/category pages (product URLs are manually curated in the YAML)

## Decisions

### Use runScraper helper
All existing scrapers delegate to `runScraper` with an extractor config object. barfworld.ts will use the same pattern to stay consistent and avoid duplicating fetch/error-handling logic.

### Title selector: `h1.product-title.title`
The product page HTML shows a single `<h1 class="product-title title">` for the product name. This is specific enough to not collide with other headings.

### Ingredients selector: `#panel-ingredients .metafield-rich_text_field p:first-of-type`
The ingredients are in the first `<p>` inside the `.metafield-rich_text_field` div within `#panel-ingredients`. Using `:first-of-type` ensures only the ingredient list paragraph is taken, not any trailing text.

### Analytical constituents selector: `#panel-guaranteed-analysis .metafield-rich_text_field li`
The guaranteed analysis panel lists each nutrient as a plain `<li>` item (e.g. "Crude Protein - minimum 18.00%"). Unlike other scrapers that split label/value from a table, these are pre-formatted single strings. All `<li>` texts are joined with `"; "` to produce the constituents string.

### Composition text: ingredients + newline + constituents
Same join strategy as avlskovgaard — ingredients description first, analytical constituents second, empty parts filtered out.

## Risks / Trade-offs

- [barfworld.com may change their Shopify theme] → Selectors are documented in `barfworld.selectors.md`; failure surfaces as empty fields rather than a crash (runScraper handles missing elements gracefully)
- [Panel IDs may differ on non-supplement products] → Acceptable — missing panels yield empty strings; composition will contain only the sections present
