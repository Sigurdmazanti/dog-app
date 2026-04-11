# Amanova — Selector Reference

**Homepage:** https://www.amanova.com/  
**Scraper:** `amanova.ts`  
**Domain:** `amanova.com` (Shopify storefront)

## HTML Example

```html
<div class="product__title">
  <h1 id="title-product">Adult mini sensitive</h1>
</div>
<h2 class="caption-with-letter-spacing inline-richtext product__text">Salmon deluxe</h2>

<div class="accordion product__accordion">
  <details>
    <summary><h2 class="accordion__title h4 inline-richtext">Ingredients</h2></summary>
    <div class="accordion__content rte">
      <div class="metafield-rich_text_field">
        <p>Freshly prepared salmon 71%, whole green peas, dehydrated potato, ...</p>
      </div>
    </div>
  </details>
</div>

<div class="accordion product__accordion">
  <details>
    <summary><h2 class="accordion__title h4 inline-richtext">Components</h2></summary>
    <div class="accordion__content rte">
      <span class="metafield-multi_line_text_field">
        Crude protein 27.00%, crude fat 17.00%, omega-3 fatty acids 2.50%, ...
      </span>
    </div>
  </details>
</div>
```

## Selectors

| Field | Selector |
|---|---|
| Title | `#title-product` + `h2.product__text` joined with ` — ` |
| Ingredients description | `.accordion__content .metafield-rich_text_field` (first match = Ingredients accordion) |
| Composition text | ingredients + `.accordion__content .metafield-multi_line_text_field` (Components accordion) |

## Notes

- Shopify-based storefront — accordion structure uses `<details>`/`<summary>` elements
- Two accordions relevant: "Ingredients" (first) and "Components" (nutritional data)
- No product URLs added yet — add to `amanova.yaml` when products are identified
