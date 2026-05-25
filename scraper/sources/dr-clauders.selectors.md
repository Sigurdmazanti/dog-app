# Dr. Clauder's Selectors Reference

**Homepage**: https://www.dr-clauder.com/

## Representative HTML

```html
<!-- Product title -->
<h1 class="product-detail__title small-title">Wildlife Salmon</h1>

<!-- Composition tab content (active tab panel) -->
<div class="tab-content tw-p-6 rte tab-content--active" id="composition-content">
  <p>
    <strong>Complete food for adult dogs.</strong><br>
    <strong>Composition</strong>: Salmon 28%, salmon meal 17%, potato starch, sweet potatoes (dried), ...<br>
    <strong>Analytical Constituents</strong>: Crude protein 23%, crude fat 12%, crude fiber 3%, crude ash 8.5%, calcium 1.5%, phosphorus 1%, sodium 0.4%.<br>
    <strong>Additives/kg: Nutritional additives</strong>: Vitamins: A 12,000 IU, D3 1,200 IU, ...<br>
    <strong>Technological additives</strong>: Antioxidants (strong tocopherol-rich extracts of natural origin, propyl gallate).
  </p>
</div>

<!-- Listing page — product link -->
<div class="product-block">
  <div class="product-block__image-container">
    <a class="product-block__image" href="/en/products/wildlife-salmon">...</a>
  </div>
</div>

<!-- Listing pagination -->
<div class="pagination">
  <span class="next">
    <a href="/en/collections/hund?page=2&filter.p.m.custom.futterart=dry+food">Next</a>
  </span>
</div>
```

## Selectors

| Field | Selector | Notes |
|---|---|---|
| Title | `h1.product-detail__title` | `.text().trim()` |
| Ingredients description | `#composition-content` | Full `.text().trim()` — contains ingredients, analytical constituents, and additives in one block |
| Composition text (AI input) | `#composition-content` | Same as above; AI mapper splits into sections |
| Product link (listing) | `.product-block > .product-block__image-container a.product-block__image` | `href` attribute |
| Pagination next | `.pagination > .next > a` | `href` attribute |

## Extraction Logic

1. **Title** — select `h1.product-detail__title`, read `.text().trim()`
2. **Ingredients description** — select `#composition-content`, read `.text().trim()`
3. **Composition text** — same as ingredients description; the AI mapper (`mapProductCompositionWithAI`) is responsible for separating the Composition, Analytical Constituents, and Additives sections from the single text block

## Notes

- Product pages must use the `/en/` URL prefix to return English-language content; otherwise the page renders in German
- The `#composition-content` panel is activated by default on product pages (the `tab-content--active` class is present in the initial HTML response)
- The `misc` food type covers two separate listing URLs: `nutritional+supplements` and `Beauty+%26+Care`
