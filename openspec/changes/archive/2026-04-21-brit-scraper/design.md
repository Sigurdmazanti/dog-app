## Context

The scraper project follows a consistent pattern: one TypeScript scraper module per brand, a YAML source file with product URL lists, a selector reference markdown, and a `sourceRegistry.ts` entry. Brit is currently absent. The `brit-petfood.com` product pages use a distinct HTML structure compared to previously implemented scrapers — fields are marked with `<strong>` label prefixes inside `<p>` elements rather than via heading hierarchy.

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description, and analytical constituents (including metabolizable energy) from `brit-petfood.com` product pages using Cheerio
- Register `brit-petfood.com` in `sourceRegistry.ts` so existing dispatch logic routes URLs to the new scraper without modification
- Provide a fully populated `brit.yaml` with all known product URLs and matching `productCounts`
- Document selectors in `brit.selectors.md` for future maintainability

**Non-Goals:**
- Scraping/parsing any Brit cat product pages
- Handling pagination or dynamic JavaScript rendering (British pages are server-rendered)
- Storing scraped data — output is passed to existing pipeline infrastructure unchanged

## Decisions

### Decision 1: Title selector — `h1[itemprop="name"]` over `h1.title`

Both `h1[itemprop="name"]` and `h1.title.mt-1` identify the title. The `itemprop` attribute is a semantic schema.org annotation unlikely to be changed for non-SEO reasons; class names (`mt-1`, `title`) are presentation utilities more likely to change. Using `h1[itemprop="name"]` is lower-fragility.

**Alternative considered**: `h1.title` — rejected because utility class names are less stable.

### Decision 2: Composition — dedicate `p.composition` CSS class

The composition paragraph has a unique `class="composition"` attribute not present on any other paragraph. Selecting `p.composition` is precise and avoids relying on sibling/traversal logic.

The raw `.text()` call yields `"Composition:ingredients..."` (Cheerio concatenates strong + text nodes). The label is stripped by cloning the element, removing the `<strong>` child, then calling `.text().trim()`.

**Alternative considered**: CSS `:has()` or sibling traversal — unnecessary given the unique class.

### Decision 3: Analytical constituents — generic `findLabelledParagraph` helper

Analytical ingredients and metabolizable energy are plain `<p>` elements with a `<strong>` label prefix but no distinguishing class. A reusable `findLabelledParagraph($, labelText)` helper iterates all `<p>` elements, checks the first `<strong>` child's trimmed text against the target label, then returns the paragraph's text with the label stripped.

`extractCompositionText` returns the analytical ingredients text. Metabolizable energy, when present, is appended after a newline (matching the bozita ADDITIVES pattern) — keeping the final string coherent for downstream parsing.

**Alternative considered**: Positional `eq()` indexing — rejected because position is not guaranteed stable across different product variants.

### Decision 4: Source YAML includes `misc` food type for supplement products

Brit has a category of vitamin/supplement products that are dog products but not food. These are included under `misc` in `brit.yaml` to maintain URL completeness and match the existing project convention established by other sources that use non-standard food-type keys.

### Decision 5: Exclude malformed `en/node/1095385` URL from YAML

One URL in the wet batch uses a `/en/node/...` path instead of `/en/products/dogs/...`. This is a CMS node URL and unlikely to have a product page with extractable nutritional data. It is excluded from `brit.yaml`; the `productCounts.wet` value reflects only valid product URLs.

## Risks / Trade-offs

- **Page structure variation** → Mitigation: The `findLabelledParagraph` helper returns empty string gracefully if a label is absent, matching existing scraper conventions.
- **Duplicate product IDs (dry)** → Two URLs share the slug `brit-care-dog-hypoallergenic-adult-small-breed` with different numeric IDs (1074658, 1074261); both are valid, distinct product pages and are included. No deduplication required.
- **Supplement pages may lack nutritional fields** → Mitigation: `misc` scrape results with empty composition fields are handled downstream by existing pipeline logic — no scraper-level change needed.
