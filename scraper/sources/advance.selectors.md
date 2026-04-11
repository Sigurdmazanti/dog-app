# Advance — Selector Reference

**Homepage:** https://www.advancepet.com.au/  
**Scraper:** `advance.ts`  
**Domain:** `petfood.advancepet.com.au`

## HTML Example

```html
<h1 class="product-title">ADVANCE™ Sensitive Skin & Digestion Large Puppy Turkey and Rice</h1>

<div class="ni-inside-box">
  <div class="nutritional-table">
    <table>
      <tr><td>Protein, crude</td><td>34%</td></tr>
      <tr><td>Fat, crude</td><td>20%</td></tr>
      <tr><td>Moisture</td><td>8.50%</td></tr>
      <tr><td>Ash</td><td>7%</td></tr>
    </table>
  </div>
  <div class="formulation">
    <div class="ingredients">
      <div class="ings-content">
        <div class="metafield-rich_text_field">
          <p>Poultry Meal (Chicken &amp; Turkey &/Or Duck), Rice, Sorghum, ...</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Selectors

| Field | Selector |
|---|---|
| Title | `h1.product-title` |
| Ingredients description | `.ings-content .metafield-rich_text_field` |
| Composition text | ingredients description + `.nutritional-table table tr` label/value pairs |

## Notes

- Product URLs use `petfood.advancepet.com.au` (not `www.advancepet.com.au`)
- Nutritional table iterates rows: each `<tr>` has two `<td>` cells (label, value)
- Some product URLs contain encoded characters: `%E2%84%A2` for the ™ symbol
