## Context

The scraper pipeline uses a `runScraper` helper with Cheerio-based selector callbacks to extract product title, ingredients description, and composition from brand-specific product pages. Each brand has a source JSON defining product URL groups and an optional `discovery` block for paginated listing crawls. A source registry maps domains to scraper functions.

Eden Pet Foods (`edenpetfoods.com`) is a UK brand selling dry, wet, treats, and misc dog food products via a WooCommerce-style shop with query-string-based category filtering and multi-page listings.

## Goals / Non-Goals

**Goals:**
- Implement a Cheerio scraper for `edenpetfoods.com` product pages
- Define a source JSON with all four food-type groups (dry, wet, treats, misc) and a pagination-based discovery config
- Register the domain in `sourceRegistry.ts`
- Document selectors in a `.selectors.md` file

**Non-Goals:**
- Scraping non-dog products or partner/affiliate pages
- Handling JavaScript-rendered content (all needed data assumed to be in server-rendered HTML)

## Decisions

### 1. Pagination with duplicate next-button selector

The listing pages render the pagination widget twice — once above and once below the product grid — both matching `.pages .pagination .paginate_button.page-item.next`. The discovery crawler uses Cheerio, so both elements are present in the DOM.

**Decision:** Target only the first matching element using Cheerio's implicit `.first()` behaviour (i.e., `$(nextSelector).attr('href')` returns the `href` of the first match). No special-casing is needed; the duplicate renders an identical link so taking the first is safe and correct.

**Alternative considered:** Scoping the selector to only the bottom widget. Rejected because it adds selector fragility; both elements carry the same link.

### 2. Food-type grouping

Eden Pet Foods uses query-string URLs (`?sub-category=...` and `?format=...`) rather than path segments, so food-type assignment cannot be inferred from URL structure. Grouping is determined declaratively by which `discovery.listings` entry a URL was discovered from.

**Decision:** List all category URLs explicitly in `discovery.listings` with an explicit `foodType` per entry. This matches the established pattern and ensures correct classification without AI fallback for known pages.

### 3. Ignored / out-of-scope URLs

Several partner/affiliate URLs (e.g. `https://www.edenpetfoods.com/partners/product?sid=...`) and at least one physical product (antler chew) are not food products. These will not appear in `discovery.listings` or `products`, and are noted in the spec as excluded URLs.

### 4. Extraction selectors (to be confirmed against live HTML)

Based on the WooCommerce conventions common to `edenpetfoods.com`, the expected selector patterns are:
- **Title**: `h1.product_title` (standard WooCommerce)
- **Ingredients / composition**: tab panel or description `div` — to be confirmed from live HTML and documented in the selector reference

## Risks / Trade-offs

- [HTML structure unknown until tested] → Selector choices in `scraper/src/scrapers/edenpetfoods.ts` must be validated by running the scraper against a real product URL before treating them as final; update the spec and selector reference if the markup differs.
- [Query-string pagination] → Some category URLs use `?sub-category=` filtering. If the WooCommerce paginator appends pagination params to query-string URLs differently from path-based pages, the `nextSelector` link href may need normalisation. Verify during implementation.
- [Duplicate pagination widget] → Relying on first-match behaviour is stable but undocumented in the discovery crawler. Confirm that `$(nextSelector).attr('href')` picks the first element when two exist.
