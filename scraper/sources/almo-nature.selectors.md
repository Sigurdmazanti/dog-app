# Almo Nature — Selector Reference

**Homepage:** https://www.almonature.com/en/  
**Scraper:** `almo-nature.ts`  
**Domain:** `almonature.com`

## HTML Example

```html
<h1 class="Product__hero_details_title_brand">
  <span class="product-category">HFC Natural</span>
  <span class="product-flavor">Veal with Ham</span>
</h1>

<section class="Product__Description">
  <div class="Product__Description_ingredients">
    <div class="Product__Description_ingredients_text">
      <div class="Product__analytical">
        <div id="constituents">
          <ul>
            <li><span>Crude Protein</span> <span>10 %</span></li>
            <li><span>Crude Fibre</span> <span>0,4 %</span></li>
            <li><span>Crude Fat</span> <span>5 %</span></li>
          </ul>
        </div>
      </div>
      <div class="Product__ingredients" id="composition">
        <p>Meat and animal derivatives* 53,8% (beef* 4%), vegetables* ...</p>
      </div>
      <div class="active Product__additives">
        <p>Additives - nutritional additives: vitamin E (3a700) 94 mg/kg ...</p>
      </div>
    </div>
  </div>
</section>
```

## Selectors

| Field | Selector |
|---|---|
| Title | `span.product-category` + `span.product-flavor` joined with a space |
| Ingredients description | `#composition` |
| Composition text | ingredients + `#constituents ul li` items (joined with `;`) + `.Product__additives` text |

## Notes

- Product URLs use numeric IDs: `/en/dog-products/800` — the ID determines the product, not the slug
- Both `/en/` and `/en-us/` locales are covered by the same scraper (domain is the same)
- Dry products use `/en/dog-products/` IDs in the 700–9400 range; wet use 200–5500 range
