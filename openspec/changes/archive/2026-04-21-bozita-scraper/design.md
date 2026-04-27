## Context

The scraper project extracts nutritional product data (title, ingredients, analytical constituents) from pet food brand websites using Cheerio for HTML parsing. Each brand gets a dedicated scraper module, a YAML source file listing product URLs, and a selector reference document. All scrapers are registered in `sourceRegistry.ts` so the CLI can dispatch any URL to the correct scraper.

Bozita is a Swedish pet food brand at `bozita.com`. Its product pages present composition data in a flat `div.product-detail` block with `h5` headings (`COMPOSITION`, `ADDITIVES (PER KG)`, `ANALYTICAL CONSTITUENTS`) and `p` elements immediately following each heading. The product title is in `h1.headline`.

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description, and analytical constituents from `bozita.com` product pages
- Register Bozita in the source registry so existing CLI and batch runner dispatch works without changes
- Provide a populated YAML source file with 30 dry, 22 wet, and 5 treat product URLs
- Document HTML selectors in a selector reference file

**Non-Goals:**
- Handling multi-language variants of `bozita.com` (Swedish vs. English) — scraper targets English pages only
- Scraping cat food products — only dog food URLs are in scope
- Any app-layer or Supabase schema changes

## Decisions

### Decision: Find `p` elements via `h5` sibling traversal

The `div.product-detail` block has no unique IDs or class names per section. Sections are separated by `h5` headings followed immediately by `p` elements. The scraper SHALL locate the correct `h5` by matching its trimmed text content and then read the immediately following `p` sibling's text.

**Alternative considered:** CSS `:has()` or positional index — fragile if Bozita adds or reorders sections, so sibling traversal by heading text is preferred.

### Decision: Append additives text to analytical constituents

Additives (`ADDITIVES (PER KG)` section) are nutritional supplements that form part of the full analytical picture, mirroring how the Bosch scraper appends `Supplements` to `Analytical components`. The `extractCompositionText` extractor SHALL return the analytical constituents paragraph followed by the additives paragraph (newline-separated), not just the analytical constituents alone.

**Alternative considered:** Separate `additives` field — no such field exists in `ScrapeResult`; appending is consistent with how all other scrapers handle supplementary analytical text.

### Decision: Title from `h1.headline` only — no sub-brand prefix

Unlike Bosch (which composes a sub-brand link + h1), Bozita product pages carry the full product name directly in `h1.headline`. No secondary brand element is present in the example markup. The scraper reads only `h1.headline`.

## Risks / Trade-offs

- **Site structure changes** → Bozita may rename or restructure `div.product-detail` headings; mitigation: return empty string on missing headings rather than throwing, and log via the existing `runScraper` error boundary.
- **Missing sections** → Not all products may include an `ADDITIVES (PER KG)` section; mitigation: filter empty strings before joining, consistent with the Bosch pattern.
