# Avlskovgaard — Selector Reference

**Homepage:** https://avlskovgaard.dk/  
**Scraper:** `avlskovgaard.ts`  
**Domain:** `avlskovgaard.dk`

## HTML Example

```html
<div class="product__title">
  <h1 style="font-size:18px;line-height:114%;text-transform: none;">
    TØRFODER TOPPING MED OKSE
  </h1>
  <a href="/products/torfodder-topping-med-okse" class="product__title">
    <h2 class="h1" style="font-size:18px;line-height:114%;">
      TØRFODER TOPPING MED OKSE
    </h2>
  </a>
</div>

<div class="accordion__content rte" id="ProductAccordion-...">
  <h2><strong>TØRFODER TOPPING MED OKSE</strong></h2>
  <p><em><strong>Flydende konsistens</strong></em></p>
  <h3><span style="font-size: 120%;">INGREDIENSER</span></h3>
  <p><span style="font-weight: 400;">Animalske biprodukter (okse: knogler og bløddele), gulerod, knoldselleri, æbler, ærter, kartoffelmel, timian, æblecideredikke og vand. Kan indeholde spor af kylling og lam.</span></p>
  <p>300 ml</p>
  <h3>Næringsindhold pr. 100 g</h3>
  <table class="nutrition-table">
    <thead>
      <tr>
        <th>Næringsindhold</th>
        <th>Indhold</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="Næringsindhold">Energi</td>
        <td data-label="Indhold">31 kcal</td>
      </tr>
      <tr>
        <td data-label="Næringsindhold">Råprotein</td>
        <td data-label="Indhold">2,99 g</td>
      </tr>
      <tr>
        <td data-label="Næringsindhold">Råfedt</td>
        <td data-label="Indhold">1,97 g</td>
      </tr>
      <tr>
        <td data-label="Næringsindhold">Råaske</td>
        <td data-label="Indhold">0,3 g</td>
      </tr>
      <tr>
        <td data-label="Næringsindhold">Råfibre (Træstof)</td>
        <td data-label="Indhold">0,14 g</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Selectors

| Field | Selector / Approach |
|---|---|
| Title | `div.product__title h1` (text, trimmed) |
| Ingredients description | The `<p>` immediately following the `<h3>` element inside `.accordion__content.rte` whose text includes `INGREDIENSER`; retrieved via `next('p')` on the matched heading; text is trimmed |
| Analytical constituents | All `table.nutrition-table tr` body rows; each row's first `<td>` is the label and second `<td>` is the value, formatted as `Label: value`, joined with `; ` |

## Notes

- URL pattern: `https://avlskovgaard.dk/products/<product-slug>`
- Shopify product pages render two headings with the same product name: an `<h1>` inside `div.product__title` and an `<h2 class="h1">` in the anchor tag below it. The selector `div.product__title h1` targets only the true heading.
- The `INGREDIENSER` heading may contain inner `<span>` elements for styling; the `<h3>` text check uses `.text()` which flattens inner elements, so the match is robust.
- Labels are in Danish and are extracted as-is (no translation applied).
- Number formatting uses Danish locale: `,` as decimal separator (e.g. `2,99 g`, `0,14 g`) — values are stored as raw strings.
- The `table.nutrition-table` `<thead>` row contains `<th>` elements; only `<tbody>` rows with `<td>` pairs carry nutrient data. Iterating all `tr` elements and checking for `td` children naturally skips the header row.
