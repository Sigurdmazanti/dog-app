## Context

The scraper project collects pet food product data (title, ingredients, analytical constituents) from brand websites using Cheerio. Each brand has a dedicated TypeScript scraper function registered in `sourceRegistry.ts` and a companion `sources/<brand>.yaml` for product URL lists. Arion is a Danish brand running a **WooCommerce** storefront at `arion-petfood.dk`.

The HTML provided confirms:
- Nutritional data is split across two `.nutrition-tab__table` panels: one for macro analytical constituents (`Næringsindhold`) and one for vitamins/minerals per kg (`Ernæring/kg`). Both panels use `.nutrition-tab__table__row` rows with a pair of `<span>` elements (label + value). Extended rows are in `.extra-rows` child divs but share the same row class.
- Ingredients are inside `#tab-description` (a WooCommerce tab panel), listed as `<li>` elements in a `<ul>` that follows a `<b>Ingredienser:</b>` paragraph.
- The product title is in `h1.entry-title.product_title` — a stable WooCommerce selector.
- Labels are in Danish; no translation is applied (consistent with other scrapers).

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description, and analytical constituents from `arion-petfood.dk` product pages
- Register the scraper in `sourceRegistry.ts` so `findSource` dispatches Arion URLs correctly
- Add `arion.yaml` and `arion.selectors.md` companion files following the established pattern

**Non-Goals:**
- Translating Danish nutritional labels to English
- Discovering or cataloguing product URLs (supplied externally)
- Handling pagination or category listing pages

## Decisions

### Use `h1.entry-title.product_title` for the title
WooCommerce adds both `entry-title` and `product_title` classes to the `<h1>`. Using both classes as a compound selector is more specific than either alone and avoids false matches on non-product pages. This mirrors how other scrapers use stable semantic selectors (`itemprop="name"` for Antos).

### Collect all `.nutrition-tab__table__row` spans for composition text
Both nutrition panels share the `.nutrition-tab__table__row` class and the same inner structure (two `<span>` elements — label and value). Iterating all rows across both tables with `.nutrition-tab__table .nutrition-tab__table__row` produces a flat list of `Label: value` entries covering macros, vitamins, and minerals, without needing to distinguish between the two table headings. This is simple, complete, and consistent with how Antos aggregates `table tr` rows.

### Extract ingredients as trimmed `<li>` text joined by `, `
The ingredients `<ul>` in `#tab-description` follows a `<b>` element whose text is `Ingredienser:`. Collecting `<li>` text and joining with `, ` produces a clean comma-separated ingredient string, consistent with the output shape of other scrapers. Navigation through the DOM is by sibling `<ul>` after the paragraph containing `Ingredienser:`.

### Domain matcher: `arion-petfood.dk`
The full domain string is unique and maps unambiguously to this brand. Consistent with existing entries like `antos.eu` and `applaws.com`.

## Risks / Trade-offs

- **Danish locale number formatting** — values like `1.000 ppm` use `.` as a thousands separator and `,` as decimal. These are extracted as raw strings without normalisation; downstream consumers are responsible for parsing. → No mitigation required at the scraper layer.
- **WooCommerce theme updates** — If the theme changes class names, selectors may break. The `entry-title product_title` compound selector is standard WooCommerce core and unlikely to change. → Monitor in scraper run logs.
- **Hidden `.extra-rows`** — The HTML shows `display:block` on `.extra-rows` in the static page source. Cheerio parses static HTML, so these rows are always present regardless of the inline style. → No JavaScript rendering needed.
