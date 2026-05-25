## Context

Essential Foods uses a Shopify-based theme (`essentialfoods.com`). Product data is presented via collapsible `<details>`/`<summary>` accordion elements rendered server-side — the full content is present in the static HTML. This is simpler than RSC-based sites (e.g. Edgard & Cooper) where data is embedded in script payloads.

There are four accordion sections per product page, though not every product has all four:
- **THE RECIPE** — ingredient list (ingredients description)
- **NUTRITIONAL VALUES** — `<ul class="nutritional-values">` with label/percentage pairs
- **ADDITIVES PER KG** — free-text additives block
- **ADDITIONAL INFORMATION** — storage / preparation info (not scraped)

Discovery uses listing pages per food type. The "load more" button is JS-driven (`.js-load-more`) and not a standard anchor, so the existing pagination (`nextSelector`) mechanism cannot follow it. URLs will be supplied manually.

## Goals / Non-Goals

**Goals:**
- Extract title, ingredients description, and composition text from `essentialfoods.com` product pages
- Register `essentialfoods.com` in the source registry
- Configure discovery block with listing URLs, product link selector, and excluded URL list
- Provide a selector reference doc

**Non-Goals:**
- Automated pagination traversal (JS load-more cannot be followed by the static crawler)
- Scraping the "ADDITIONAL INFORMATION" accordion (prep/storage only, not nutritional data)
- Scraping supplements/accessories (licking mat, oil bundles, mix boxes)

## Decisions

### Decision: Find accordion sections by summary text, not positional index

The number of accordions varies per product (typically 3–4). Using a helper that scans `details.accordion` elements and matches the `summary.accordion__title` text ensures the correct section is always found regardless of order or count.

**Alternatives considered:** Positional selectors like `details.accordion:nth-child(2)` — rejected because section order is not guaranteed and products with fewer accordions would yield wrong data.

### Decision: Ingredients description = THE RECIPE accordion content

The `metafield-rich_text_field` `<p>` inside the "THE RECIPE" accordion contains the raw ingredient list. This maps directly to `extractIngredientsDescription`.

### Decision: Composition text = NUTRITIONAL VALUES + ADDITIVES PER KG

`extractCompositionText` joins the nutritional values list (formatted as "Description: Percentage" pairs) with the additives free-text block. The ADDITIONAL INFORMATION section is excluded — it is storage/preparation copy, not analytical data.

### Decision: Nutritional values serialised as "Label: Value" lines

The `<ul class="nutritional-values">` items each have `.nutritional-description` and `.nutritional-percentage`. These are joined as `"<description>: <percentage>"` lines, consistent with how other scrapers serialise tabular composition data.

### Decision: Excluded URLs stored in `needsReview` array in source JSON

Bundle packs, taste boxes, and accessory URLs that should never be scraped are listed in `needsReview` so the discovery diff tooling can identify and skip them without losing the record of why.

## Risks / Trade-offs

- **Site HTML changes** → Accordion section titles ("THE RECIPE", "NUTRITIONAL VALUES") are user-visible strings; a site rebrand could break selector matching. Mitigation: empty-string fallbacks prevent crashes; failed scrapes surface via the diff tool.
- **JS load-more pagination** → Listing pages show a limited set of products until the button is clicked. Discovery will only see products loaded on the initial server render. Mitigation: product URLs are supplied manually for the initial population.
- **Missing accordions** → Some product types (e.g. supplements) may have only 1–2 accordions. The helper returns `""` for any missing section, so no exception is thrown.
