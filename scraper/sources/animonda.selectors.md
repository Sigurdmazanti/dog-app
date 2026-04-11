# Animonda — Selector Reference

**Homepage:** https://animonda.de/en/  
**Scraper:** `animonda.ts`  
**Domain:** `animonda.de`

## HTML Example

```html
<h1 class="product-detail-title h2">GranCarno Multi Meat Cocktail</h1>

<div class="product-detail-composition__main-content">
  <h3 class="h4">Composition</h3>
  38% beef (lung, meat, liver, kidney, udder, heart), 18% chicken (heart, neck, stomach), ...
</div>

<div class="tab-pane-container product-detail-ingredients">
  <ul class="product-detail-ingredients__list">
    <li class="product-detail-ingredients__list-item">
      <span class="product-detail-ingredients__item-description">crude protein </span>
      <span class="product-detail-ingredients__item-value">10.5 %</span>
    </li>
    <li class="product-detail-ingredients__list-item">
      <span class="product-detail-ingredients__item-description">fat content </span>
      <span class="product-detail-ingredients__item-value">7.5 %</span>
    </li>
  </ul>
</div>

<div class="tab-pane-container product-detail-nutritional-additives">
  <ul class="product-detail-nutritional-additives__list">
    <li><p>200 IE Vitamin D3</p></li>
    <li><p>1,4 mg Manganous sulphate monohydrate</p></li>
  </ul>
</div>
```

## Selectors

| Field | Selector |
|---|---|
| Title | `h1.product-detail-title` |
| Ingredients description | `.product-detail-composition__main-content` (clone, remove inner `h3`, get remaining text) |
| Composition text | ingredients + `.product-detail-ingredients__list-item` label/value pairs + `.product-detail-nutritional-additives__list li p` items |

## Notes

- URL pattern: `/en/product/<slug>/<product-id>-0` — the numeric ID is the key identifier
- Products span GranCarno, Vom Feinsten, and BugBell sub-brands — all same HTML structure
- Same product IDs appear across different size variants (different numeric suffix)
- `bugbell-*` products are insect-based recipes
