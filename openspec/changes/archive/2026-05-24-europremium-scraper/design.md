## Context

The scraper project extracts dog food product data from vendor websites using Cheerio (server-rendered HTML). A standard `runScraper` helper handles HTTP fetching, Cheerio loading, and result assembly; each brand scraper only needs to provide three extraction functions. The source registry maps domains to scraper functions. Source JSON files carry brand metadata, discovery config (listing URLs + pagination), and manually-curated product URL lists.

EuroPremium product pages at `europremium.com/en/products/<slug>` are server-rendered. Each product exposes two data panels via `.product-components` elements identified by `san-id` attributes:
- `san-id="open-Composition"` — the ingredients / recipe text
- `san-id="open-Analytical components"` — the analytical constituents text

The product listing at `https://europremium.com/en/products` paginates across 3 pages. Next-page links match `.products .pagination .pagination__item:last-of-type`; individual product links match `.products .products--grid a.products__item`.

## Goals / Non-Goals

**Goals:**
- Extract title, ingredients description, and analytical composition from EuroPremium product pages
- Register the `europremium.com` domain in `sourceRegistry.ts`
- Provide source JSON with discovery config and pre-populated product URL lists for `dry`, `wet`, `treats`, and `misc` food types
- Document selectors in a selector reference file

**Non-Goals:**
- Scraping non-dog products or supplement tablets beyond `misc` categorisation
- Automated testing of selectors against the live site
- Any changes to the mobile app or Supabase schema

## Decisions

### Decision: Use `san-id` attribute selectors for content panels

**Choice:** Select `.product-components__content[san-id="open-Composition"]` and `.product-components__content[san-id="open-Analytical components"]` directly.

**Rationale:** The `san-id` attributes are stable identifiers set by the CMS. They uniquely identify each panel without string-matching accordion titles (which can change with localisation). Directly targeting the content element is simpler than navigating from the title sibling.

**Alternatives considered:** Walking from the `.product-components__title` element whose text includes "Composition" to the adjacent `.product-components__content` — rejected because it requires exact text matching across locales.

### Decision: Single mixed listing with `foodType: "dry"` as discovery default

**Choice:** One `discovery.listings` entry pointing at `https://europremium.com/en/products` with `foodType: "dry"`.

**Rationale:** The site exposes one product listing for all food types. Assigning `"dry"` as the default is a safe fallback; wet, treat, and misc product URLs are fully enumerated in the `products` object, so the discovery crawler's type assignment only matters for newly-added products. Scraped products that are not dry kibble will surface in the diff/review workflow.

**Alternatives considered:** Creating a listing entry per food type — not feasible as the site has no category-filtered listing URLs.

### Decision: Title from `h1`

**Choice:** `$('h1').first().text().trim()`

**Rationale:** Product pages have a single `<h1>` holding the product name. No disambiguation needed.

## Risks / Trade-offs

- [Risk: `san-id` attributes removed in a site redesign] → Mitigation: selector reference doc captures the original HTML so a future re-scrape failure is immediately diagnosable.
- [Risk: Pagination selector `.products .pagination .pagination__item:last-of-type` may select a disabled/missing element on the last page] → Mitigation: the `runScraper` pagination loop already handles absent next-page elements gracefully; no additional handling required.
- [Risk: Mixed listing assigns `"dry"` to newly discovered wet/treat products] → Mitigation: manual product URL lists are pre-populated; new product review is part of the standard diff workflow.
