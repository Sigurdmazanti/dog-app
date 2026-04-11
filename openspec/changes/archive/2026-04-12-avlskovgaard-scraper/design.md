## Context

The scraper project collects pet food product data (title, ingredients, analytical constituents) from brand websites using Cheerio. Each brand has a dedicated TypeScript scraper function registered in `sourceRegistry.ts` and a companion `sources/<brand>.yaml` for product URL lists. Avlskovgaard is a Danish brand running a **Shopify** storefront at `avlskovgaard.dk`.

The HTML provided confirms:
- The product title is in `div.product__title h1` — a Shopify product page selector.
- Ingredients are listed as a plain-text paragraph inside a `.accordion__content.rte` block, following a `<h3>` heading containing "INGREDIENSER". The text is a single `<p>` tag containing the full ingredient string.
- Nutritional data is in a `table.nutrition-table` within the same `.accordion__content.rte` block. Each `<tr>` has two `<td>` cells — the first is the label (e.g. "Råprotein") and the second is the value (e.g. "2,99 g"). The energy row uses "Energi" as the label. All labels are in Danish.
- Labels are in Danish; no translation is applied (consistent with other scrapers).

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description, and analytical constituents from `avlskovgaard.dk` product pages
- Register the scraper in `sourceRegistry.ts` so `findSource` dispatches Avlskovgaard URLs correctly
- Add `avlskovgaard.yaml` and `avlskovgaard.selectors.md` companion files following the established pattern

**Non-Goals:**
- Translating Danish nutritional labels to English
- Discovering or cataloguing product URLs (supplied externally)
- Handling pagination or category listing pages

## Decisions

### Use `div.product__title h1` for the title
Shopify product pages place the product title in an `<h1>` inside a `div.product__title` container. Scoping to the container avoids potential conflicts with other `<h1>` elements on the page (e.g. the `<h2 class="h1">` link duplicate also present in the markup). The text is trimmed.

### Find ingredients by locating the `INGREDIENSER` heading then reading the next `<p>`
The ingredients section has no unique CSS class or ID on the paragraph itself. The reliable anchor is the `<h3>` heading whose text contains "INGREDIENSER". The ingredient text lives in the immediately following `<p>` sibling. Using `next('p')` after finding the heading is consistent with how other scrapers navigate to content by anchor element (e.g. Arion's `b[Ingredienser:]` paragraph lookup).

### Extract analytics from `table.nutrition-table tr td` pairs
Each `<tr>` in `table.nutrition-table` contains two `<td>` cells (label and value). Collecting each pair and formatting as `Label: value` joined by `; ` produces a flat constituent string, consistent with the composition-text format used by all other scrapers.

### Domain matcher: `avlskovgaard.dk`
The full domain string is unique and maps unambiguously to this brand. Consistent with existing entries.

## Risks / Trade-offs

- **Danish locale number formatting** — values like `2,99 g` use `,` as the decimal separator. Values are extracted as raw strings without normalisation; downstream consumers are responsible for parsing. → No mitigation at the scraper layer.
- **Single accordion block** — The HTML shows one `.accordion__content.rte` block containing both ingredients and the nutrition table. If Avlskovgaard adds multiple accordion sections adding tables elsewhere in the DOM, the `table.nutrition-table` selector could match unintended tables. → The `.nutrition-table` class is explicit enough to act as a reliable guard.
- **Title duplication** — The page contains both an `<h1>` and an `<h2 class="h1">` with the same product name. Scoping the selector to `div.product__title h1` ensures only the true heading is captured.
