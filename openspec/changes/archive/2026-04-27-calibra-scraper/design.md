## Context

`mycalibra.eu` is a Shopify-hosted storefront. Product pages use a collapsible accordion pattern (`<details>`/`<summary>`) with custom Shopify section IDs. The composition block is inside a single accordion panel labelled "Composition" and contains ingredients, analytical constituents, metabolisable energy, nutritional additives, and antioxidant info all as one `<p>` element with `<br><br>`-separated paragraphs.

The existing scraper infrastructure (`runScraper`, `sourceRegistry`, source YAML + selectors.md) is well-established. This is a standard additive change following the same file/module pattern as Antos, Applaws, and the other scrapers.

## Goals / Non-Goals

**Goals:**
- Extract product title from `h1.product-title`
- Extract ingredients description (text before `Analytical constituents:`) from the "Composition" accordion panel
- Extract composition text (everything from `Analytical constituents:` onwards in the same panel) for the `extractCompositionText` field
- Register `mycalibra.eu` in the source registry
- Provide `calibra.yaml` (structure only, URLs to be filled in by the user) and `calibra.selectors.md`

**Non-Goals:**
- Scraping the product URL list automatically (user will supply URLs)
- Scraping the "Instructions" accordion or any other panel
- Any changes to the app layer or Supabase schema

## Decisions

### Accordion panel selection strategy

The Calibra "Composition" `<details>` element has a dynamically generated UUID-based `id` attribute (e.g., `Details-386f7e4a-...`). These IDs are not stable across Shopify re-deploys.

**Decision**: Select the accordion panel by matching `summary h3.accordion__title` text content to `"Composition"` rather than by `id`.

```
details:has(summary h3.accordion__title)
```
Filter in JavaScript to the `<details>` whose `summary h3` text is `"Composition"`, then read `div.accordion__content .metafield-rich_text_field`.

*Alternative considered*: Matching on the `id` prefix `Details-`. Rejected — UUIDs are generated at theme compile time and could change on theme updates.

### Splitting ingredients from analytical constituents

The accordion body contains one `<p>` with the full product data separated by `<br><br>`. The first paragraph is the ingredients list (starts with `"Composition: "`); the second starts with `"Analytical constituents: "`.

**Decision**: Read the full `.metafield-rich_text_field` text and split on `"Analytical constituents:"` (case-insensitive).
- Text before the split point → `extractIngredientsDescription` (strip the leading `"Composition: "` prefix)
- Text from the split point onwards → `extractCompositionText`

This mirrors the approach used by Antos (which splits on `<strong>` labels) but adapted for Calibra's flat text structure.

### Source registry domain key

**Decision**: Use `"mycalibra.eu"` as the domain match string — matches the actual hostname and avoids false positives.

## Risks / Trade-offs

- **Shopify theme updates** → The `h3.accordion__title` class and `div.accordion__content` hierarchy are Shopify-standard and unlikely to change, but a theme upgrade could alter them. Mitigation: selectors.md documents the stable selectors; tests catch regressions.
- **Paragraph split fragility** → If Calibra rewrites product pages and removes the `"Analytical constituents:"` separator, the split will return the full text as ingredients and an empty composition. Mitigation: acceptable graceful degradation; no crash risk.
- **Product URL count unknown** → YAML product counts will start at 0 and be updated once URLs are provided.
