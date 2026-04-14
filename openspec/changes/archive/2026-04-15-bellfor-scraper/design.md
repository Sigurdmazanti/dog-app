## Context

The scraper project ingests dog food nutritional data from various brand websites using Cheerio-based HTML scrapers. Each source follows the same pattern: a `scrape<Brand>.ts` module exporting an async function that implements `ScraperExtractors`, a `sources/<brand>.yaml` listing product URLs, a `sources/<brand>.selectors.md` documenting the HTML structure, and an entry in `sourceRegistry.ts`.

`bellfor.info` uses a tabbed product page layout (OpenCart-based). The page header is an `h1.product-page-heading`. Below it, a `.product-tabs-contents.tab-content` container holds three `.tab-pane` children in a fixed order:
1. **Tab 1** (active by default) — analytical data as two `table.table-margin` elements inside `.wrap-table`: the first table covers basic values (crude protein, fat, fibre, ash, moisture, energy), the second covers nutritional additives per kg.
2. **Tab 2** — ingredients as a `<p>` element.
3. **Tab 3** — feeding guidelines table (not extracted).

All tab IDs (`tab_58856`, etc.) are dynamic and must not be relied upon.

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description, and composition text (analytical + additives) from `bellfor.info` product pages
- Register `bellfor.info` in `sourceRegistry.ts`
- Provide a source YAML with product URLs and a selector reference documenting the HTML structure

**Non-Goals:**
- Crawling or discovering URLs automatically — product URLs are added manually to `bellfor.yaml`
- Extracting feeding guidelines (tab 3)
- Supporting the VPN/IP-blocked `.info` domain — implementation uses standard axios requests; if blocked, it is a deployment concern, not a scraper design concern

## Decisions

### Decision: Use positional tab selectors rather than IDs or tab link text

Tab IDs (`tab_58856`, `tab_58857`, …) are per-product and cannot be used as stable anchors. Matching tabs by their visible link text would require navigating the DOM further. The tabs always appear in the same order (analytical → ingredients → feeding), so using `.product-tabs-contents .tab-pane` indexed by position (`.eq(0)` and `.eq(1)`) is the simplest robust approach.

*Alternative considered*: Matching by visible tab label text — rejected because it requires inspecting a sibling navigation list and is more brittle to label wording changes.

### Decision: Flatten analytical tables into key-value text lines

`runScraper` passes a plain text `compositionText` string to the AI composition mapper. The two `.table-margin` tables in tab 1 contain rows of `<td>key</td><td>value</td>`. The cleanest representation for the AI mapper is `"Key: Value"` lines joined by newline, grouped under their section header (e.g., `"Basic values:\nCrude protein: 7 %\n…"`).

*Alternative considered*: Concatenating all cell text without labels — rejected because the AI mapper benefits from labelled context.

### Decision: `extractIngredientsDescription` returns tab 2's `<p>` text

Consistent with other scrapers (e.g., Belcando), the ingredients list is returned from `extractIngredientsDescription`. `extractCompositionText` then combines ingredients with the analytical tables for the AI mapper.

## Risks / Trade-offs

- **Tab order dependence** → Mitigation: document in selectors.md; if bellfor reorders tabs, the scraper silently returns empty strings rather than throwing, and the issue will surface during a test run.
- **Table structure changes** → Mitigation: the row-iterator skips header rows by detecting the `bgcolor` attribute; additional rows or columns in future won't break extraction.
- **English vs. German pages** — bellfor.info serves an English-language store (`bellfor.info` vs. German-language `bellfor.de`). Product URLs on `bellfor.info` return English labels. The selector approach is label-independent (positional), so language does not affect correctness.
