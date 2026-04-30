## Context

The scraper supports multiple dog food brands via a shared `runScraper` helper that accepts three extraction callbacks: `extractTitle`, `extractIngredientsDescription`, and `extractCompositionText`. Each new brand requires a `sources/<brand>.json` file, a `src/scrapers/<brand>.ts` file, and a registry entry in `src/sourceRegistry.ts`.

Cesar product pages (cesar.com) present ingredient and analytical data as embedded images rather than as HTML text. Standard Cheerio selector-based extraction therefore cannot recover the nutrition fields. The product title is still available in the page `<h1>`.

## Goals / Non-Goals

**Goals:**
- Add `scrapeCesar` using the existing `runScraper` helper
- Map `cesar.com` to the new scraper in `sourceRegistry.ts`
- Add `cesar.json` source file containing all supplied wet, dry, and treats product URLs
- Extract the product title from the page `<h1>`

**Non-Goals:**
- No ingredient or analytical composition extraction in this change — those fields return empty strings until image-based extraction (OCR or similar) is introduced as a separate change
- No discovery/listing crawler — the `discovery` block is left empty per the standard new-scraper workflow
- No deduplication of suspected slug duplicates — the user has been notified and will confirm which to drop separately

## Decisions

### Decision: Stub the composition extractors instead of skipping them
The `runScraper` contract requires all three extractor callbacks. Rather than introduce conditional logic in the helper, the Cesar scraper SHALL provide the callbacks but return an empty string for `extractIngredientsDescription` and `extractCompositionText`. This keeps the helper surface unchanged and makes it trivial to swap in a real implementation later.

### Decision: Use a generic `h1` selector for the title
The product hero markup is not yet known in detail because the page is image-heavy. The first `<h1>` is the safest default and matches the convention used in other minimal scrapers. A more specific selector can be substituted once the markup is inspected.

### Decision: Filter `recipe-finder` from the wet URL list
`https://www.cesar.com/recipe-finder` was included in the supplied wet list but is a tool/landing page, not a product page. It SHALL NOT be added to `products.wet`.

### Decision: Keep `discovery` empty
Per the project convention for new scrapers, `discovery.listings` and `discovery.productLinkSelector` are left empty. Only the user-supplied URLs are populated; automated discovery can be added later.

### Decision: Do not deduplicate suspected slug duplicates yet
Several wet URLs share apparent product identity across two slug styles (e.g. `simply-crafted-chicken` vs `cesar-simply-crafted-adult-wet-dog-food-toppers-chicken-24-13-oz-tubs`, and `wholesome-bowls-...` vs `cesar-wholesome-meals-...`). The user has been listed these for confirmation. Until confirmed, all supplied URLs SHALL be retained in `products.wet`.

## Risks / Trade-offs

- [Risk] Composition data is unreachable without OCR. → Mitigation: Returning empty strings yields well-formed scrape results that downstream tooling already tolerates; a follow-up change can introduce image extraction.
- [Risk] The generic `h1` selector may pick up a non-product heading on edge pages. → Mitigation: Cesar product URLs share a consistent `/products/<type>/<slug>` structure; if a stray heading is found, a more specific selector can be added later.
- [Risk] Including suspected duplicate URLs may produce duplicate scraped rows. → Mitigation: User will confirm the dedupe set and a follow-up edit will prune the JSON.
