## Context

alphaspirit.se is a Swedish WooCommerce store built with the Elementor page builder. The site's HTML uses Elementor's auto-generated class names (e.g. `elementor-element-6276d71`), which are instance-specific and change with any layout edit — making them unsafe as selectors. Instead, the scraper must rely on semantic tag names and stable class names (e.g. `elementor-heading-title`) combined with text-content matching.

The site publishes product data in Swedish. Section headings on product pages are "Sammansättning" (ingredients/composition) and "Analys" (analytical constituents). Existing Swedish key-map aliases (`aska`, `fett`, `växttråd`, `järn`) already cover the expected analytical labels.

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description, and analytical composition text from alphaspirit.se product pages
- Register alphaspirit.se in the source registry
- Provide a source JSON with dry, wet, and treats product URL lists (empty initially — user supplies URLs later)
- Document HTML structure and selectors in a selector reference file

**Non-Goals:**
- Automated URL discovery (listings are provided manually; no paginated crawl is required)
- Handling cat product pages (explicitly excluded by user)
- Parsing or structuring nutritional values — the base runner handles that

## Decisions

### 1. Use text-matching on `h3` headings instead of dynamic class selectors

**Decision:** Locate "Sammansättning" and "Analys" sections by traversing `h3` elements and comparing trimmed text, then reading the following sibling `p`.

**Rationale:** Elementor's auto-generated positional class names (e.g. `elementor-element-6276d71`) are unstable across CMS edits. Only `elementor-heading-title` and tag names are stable. Text-matching on `h3` headings is robust against layout changes.

**Alternatives considered:** Targeting Elementor widget class chains — rejected due to instance-specific class names.

### 2. Title from `h1.elementor-heading-title`

**Decision:** Extract the product title from the first `h1.elementor-heading-title` on the page.

**Rationale:** This class is applied by Elementor's Heading widget and is consistently present on product pages. The page has a single `h1`, making it unambiguous.

### 3. Product link selector for discovery

**Decision:** Use `.woocommerce.elementor-element .product .elementor-heading-title > a` as the product link selector in the source JSON's `discovery.productLinkSelector`.

**Rationale:** This is the selector confirmed by the user as correctly targeting product title links in the WooCommerce grid, without over-matching non-product links.

### 4. Discovery listings — no pagination

**Decision:** All category listing URLs are enumerated in the `discovery.listings` array. No paginated crawl is needed.

**Rationale:** The user confirmed there is no pagination on any of the category pages.

## Risks / Trade-offs

- [Risk: Elementor class names shift after a page rebuild] → Mitigation: selectors rely on `h3` text content and `h1.elementor-heading-title`, which are semantic and stable
- [Risk: "Sammansättning" or "Analys" heading text differs on some products] → Mitigation: if the heading is not found, the extractor returns an empty string (same defensive pattern used by other scrapers); the product will surface for manual review
- [Risk: Swedish `<br>`-separated analysis paragraph may include footnote text after `*`] → Mitigation: the base runner normalisation handles footnote stripping; no special handling needed here
