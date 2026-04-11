# Arion — Selector Reference

**Homepage:** https://arion-petfood.dk/  
**Scraper:** `arion.ts`  
**Domain:** `arion-petfood.dk`

## HTML Example

```html
<h1 class="entry-title product_title">Adult Grain-Free Chicken &amp; Potato</h1>

<div class="col-md-6">
  <div class="nutrition-tab__table">
    <p>Næringsindhold
    <div class="nutrition-tab__table__row"><span>Råprotein</span> <span>25 %</span></div>
    <div class="nutrition-tab__table__row"><span>Råfedt</span> <span>15 %</span></div>
    <div class="nutrition-tab__table__row"><span>Råaske</span> <span>6,5 %</span></div>
    <div class="extra-rows" style="display:block">
      <div class="nutrition-tab__table__row"><span>Fosfor</span> <span>0,9 %</span></div>
      <div class="nutrition-tab__table__row"><span>DHA</span> <span>1.000 ppm</span></div>
    </div>
  </div>
</div>

<div class="col-md-6">
  <div class="nutrition-tab__table">
    <p>Ernæring/kg
    <div class="nutrition-tab__table__row"><span>A-Vitaminer (IU/kg)</span><span>20.000</span></div>
    <div class="extra-rows" style="display:block">
      <div class="nutrition-tab__table__row"><span>Metabolisk Energi (kcal/kg)</span><span>3.828</span></div>
    </div>
  </div>
</div>

<div class="entry-content panel wc-tab woocommerce-Tabs-panel--description"
     id="tab-description" role="tabpanel">
  <h2>Produktviden</h2>
  <p><b>Ingredienser:</b></p>
  <ul>
    <li>Kartoffel</li>
    <li>Tørret Kyllingekød</li>
    <li>Animalsk fedt</li>
  </ul>
</div>
```

## Selectors

| Field | Selector / Approach |
|---|---|
| Title | `h1.entry-title.product_title` (text, trimmed) |
| Ingredients description | `<li>` elements inside the `<ul>` that follows the `<b>` element with text `Ingredienser:` in `#tab-description`, joined with `, ` |
| Analytical constituents | All `.nutrition-tab__table .nutrition-tab__table__row` elements (including those inside `.extra-rows`); each row's first `<span>` is the label and second `<span>` is the value, formatted as `Label: value`, joined with `; ` |

## Notes

- URL pattern: `https://arion-petfood.dk/produkt/<product-slug>/`
- The `h1` uses WooCommerce standard classes `entry-title` and `product_title` — both are used as a compound selector for specificity
- Labels are in Danish and are extracted as-is (no translation applied)
- Number formatting uses Danish locale: `.` as thousands separator, `,` as decimal separator (e.g. `1.000 ppm`, `6,5 %`) — values are stored as raw strings
- Extended nutrient rows are inside `.extra-rows` child divs but use the same `.nutrition-tab__table__row` class — the CSS selector traverses into them naturally
- Two nutrition tables exist on the page: `Næringsindhold` (macro analytical constituents) and `Ernæring/kg` (vitamins and minerals) — both are captured by the same selector pass
- The `#tab-description` panel is a WooCommerce product description tab; the ingredients `<ul>` follows a `<b>Ingredienser:</b>` paragraph inside `<p>` tags
