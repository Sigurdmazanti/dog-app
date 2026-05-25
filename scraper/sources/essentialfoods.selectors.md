# Essential Foods — Selector Reference

**Domain**: `essentialfoods.com`  
**Theme**: Shopify (custom theme with `<details>`/`<summary>` accordion pattern)

## Representative HTML

```html
<div class="product__title__wrapper">
  <h1 class="heading-size-6 product__title">
    <span data-zoom-caption="">BEGINNING LARGE BREED NAUTICAL EDITION, 10KG</span>
  </h1>
</div>

<!-- Accordion: THE RECIPE -->
<details class="accordion" data-collapsible="">
  <summary class="accordion__title" data-collapsible-trigger="">THE RECIPE ...</summary>
  <div class="accordion__body rte" data-collapsible-body="">
    <div class="accordion__content" data-collapsible-content="">
      <div class="metafield-rich_text_field">
        <p>Freshly prepared salmon and trout (44%), sweet potato, peas, dried salmon (12%)...</p>
      </div>
    </div>
  </div>
</details>

<!-- Accordion: NUTRITIONAL VALUES -->
<details class="accordion" data-collapsible="">
  <summary class="accordion__title" data-collapsible-trigger="">NUTRITIONAL VALUES ...</summary>
  <div class="accordion__body rte" data-collapsible-body="">
    <div class="accordion__content" data-collapsible-content="">
      <ul class="nutritional-values">
        <li>
          <span class="nutritional-description">Protein</span>
          <span class="nutritional-percentage"> 28.0 %</span>
        </li>
        <li>
          <span class="nutritional-description">Fat</span>
          <span class="nutritional-percentage"> 15.0 %</span>
        </li>
        <!-- ... more items ... -->
      </ul>
    </div>
  </div>
</details>

<!-- Accordion: ADDITIVES PER KG -->
<details class="accordion" data-collapsible="">
  <summary class="accordion__title" data-collapsible-trigger="">ADDITIVES PER KG ...</summary>
  <div class="accordion__body rte" data-collapsible-body="">
    <div class="accordion__content" data-collapsible-content="">
      <div class="metafield-rich_text_field">
        <p>Vitamins: Vitamin A 14,423 IU, Vitamin D3 1,346 IU...</p>
      </div>
    </div>
  </div>
</details>

<!-- Accordion: ADDITIONAL INFORMATION (not scraped) -->
```

## Selector Table

| Field | Selector | Notes |
|---|---|---|
| Title | `h1.heading-size-6.product__title span[data-zoom-caption]` | Text content, trimmed |
| Ingredients description | `details.accordion` where summary contains `"THE RECIPE"` → `.accordion__content .metafield-rich_text_field p` | First `<p>` only |
| Nutritional values | `details.accordion` where summary contains `"NUTRITIONAL VALUES"` → `ul.nutritional-values li` | Each `li` has `.nutritional-description` and `.nutritional-percentage` |
| Additives | `details.accordion` where summary contains `"ADDITIVES PER KG"` → `.accordion__content .metafield-rich_text_field` | Full text content |
| Product link (listing) | `.collection-products > .collection__products .product-item-card .product-item__image > .product-link` | On collection pages |

## Extraction Logic

1. **Title**: Select `h1.heading-size-6.product__title span[data-zoom-caption]` and take trimmed text.
2. **Ingredients description**: Iterate `details.accordion` elements; find the one whose `summary.accordion__title` text includes `"THE RECIPE"`; return trimmed text of the first `<p>` inside `.accordion__content .metafield-rich_text_field`.
3. **Composition text** (joined with `\n`, empty sections omitted):
   - *Nutritional values*: Find the accordion containing `"NUTRITIONAL VALUES"`; iterate `ul.nutritional-values li`; for each `li` format as `"<.nutritional-description>: <.nutritional-percentage>"`; join lines with `\n`.
   - *Additives*: Find the accordion containing `"ADDITIVES PER KG"`; return trimmed `.accordion__content .metafield-rich_text_field` text.
4. **ADDITIONAL INFORMATION** accordion is ignored (storage/preparation copy only).

## Gotchas

- **Variable accordion count**: Products may have 2–4 accordions. Matching by summary text rather than positional index ensures correct extraction regardless.
- **JS load-more pagination**: Listing pages use a `.js-load-more` button (not a standard anchor) to load additional products. The static crawler cannot follow it. `nextSelector`-based pagination is not configured. Product URLs must be supplied manually.
- **SVG icons in summary text**: The `<summary>` contains inline `<svg>` elements for the +/− toggle; these do not affect `.text()` calls (Cheerio ignores them), but the summary text includes the SVG's whitespace. `.includes()` matching handles this correctly.
- **`data-collapsible-content` panels are server-rendered**: Unlike RSC-based sites, all accordion content is present in the initial HTML response — no JavaScript execution is needed.
