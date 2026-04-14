## Context

The scraper project uses a consistent pattern: each brand has a TypeScript scraper module exporting a single async function, a YAML source file listing product URLs by food type, a Markdown selector reference, and a `sourceRegistry.ts` entry. The `runScraper` helper handles HTTP fetching and Cheerio parsing; individual scrapers only supply field-extraction callbacks.

Belcando product pages at `belcando.com` expose composition data inside a `.product-detail-analyse-text` container. The container holds a `.row.mb-3` with multiple `.col-md` columns, each headed by a `<strong>` label ("Composition", "Analytical constituents", "Additives per kg"). No JavaScript rendering is required — the data is present in static HTML.

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description (composition), and analytical constituents (including additives) from `belcando.com` product detail pages
- Register `belcando.com` in the source registry so it is automatically dispatched to the new scraper
- Provide a selector reference and YAML source file matching the established conventions

**Non-Goals:**
- Scraping category/listing pages to discover product URLs automatically (URLs are populated manually in the YAML file)
- Normalising or transforming nutritional values beyond raw text extraction
- Any changes to the mobile app UI or Supabase schema

## Decisions

### D1: Use `runScraper` helper with extraction callbacks — same as all other scrapers

**Decision**: Export a single function `scrapeBelcando(req)` that delegates to `runScraper` with `extractTitle`, `extractIngredientsDescription`, and `extractCompositionText` callbacks.

**Alternatives considered**: Copying the fetch/parse loop inline — rejected; `runScraper` already handles retries, logging, and result shaping and there is no reason to diverge.

### D2: Match composition columns by `strong` label text, not by position

**Decision**: Iterate `.product-detail-analyse-text .row.mb-3 > .col-md` and find the column whose `strong` text equals the target label ("Composition", "Analytical constituents"). Extract the text by cloning the element, removing the `strong` child, and trimming.

**Alternatives considered**: CSS `:nth-child` positional selectors — fragile if Belcando adds or reorders columns in future; label-matching is more robust to page changes.

### D3: Append additives text to `extractCompositionText` output

**Decision**: The "Additives per kg" column text is appended to the analytical constituents in `extractCompositionText`, joined with a newline, so the full nutritional profile is captured in one field.

**Alternatives considered**: Discard additives — loses potentially relevant nutritional data.

### D4: Title selector is `h1[itemprop="name"]`

**Decision**: Use the semantic `itemprop="name"` attribute to target the product title `<h1>`. The class `product-detail-name` is also present but the `itemprop` attribute is more semantically stable.

## Risks / Trade-offs

- [Risk] Belcando's HTML structure changes → selectors break silently. Mitigation: the selector reference documents the exact HTML snapshot so regressions are visible in review.
- [Risk] Scraping Belcando EU domain may return localised content (language or currency differences). Mitigation: YAML source file targets `belcando.com` (English) only; other regions are out of scope.

## Migration Plan

1. Add `scraper/src/scrapers/belcando.ts`
2. Register entry in `scraper/src/sourceRegistry.ts`
3. Add `scraper/sources/belcando.yaml` with initial product URL list (dry food initially)
4. Add `scraper/sources/belcando.selectors.md` selector reference
5. No rollback needed — changes are additive; removing the registry entry and files reverts the change entirely.
