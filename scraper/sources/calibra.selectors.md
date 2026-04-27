# Calibra — Selector Reference

**Homepage:** https://calibrastore.co.uk/  
**Scraper:** `calibra.ts`  
**Domain:** `calibrastore.co.uk`

## HTML Example

```html
<h1 class="product-title">Calibra VD Dog Ultra-Hypoallergenic Insect Protein</h1>

<details id="Details-386f7e4a-6127-4141-928b-9cb4614ee18c-template--22400396067102__main-product" open>
  <summary>
    <h3 class="accordion__title">Composition</h3>
    <span></span>
  </summary>
  <div class="accordion__content collapsible__content rte"
       id="ProductAccordion-386f7e4a-6127-4141-928b-9cb4614ee18c-template--22400396067102__main-product">
    <div class="metafield-rich_text_field">
      <p>Composition: rice (40 %), salmon protein (26 %), dried eggs (8 %), hydrolysed salmon protein (8 %), ...<br><br>
         Analytical constituents: crude protein 28 %, crude fat 12 %, crude fibres 1.8 %, crude ash 7.5 %, moisture 10 %, ...<br><br>
         Metabolisable energy value: 3,670 kcal/kg – 15.37 MJ/kg<br><br>
         Nutritional additives per 1 kg: vitamin A (3a672a) 20,000 I.U., ...</p>
    </div>
  </div>
</details>
```

## Selectors

| Field | Selector / Strategy |
|---|---|
| Title | `h1.product-title` (text, trimmed) |
| Composition accordion panel | Iterate `details` elements; select the one whose `summary h3.accordion__title` text equals `"Composition"` |
| Full accordion body text | `div.accordion__content .metafield-rich_text_field` (text, trimmed) |
| Ingredients description | Accordion body text **before** `"Analytical constituents:"` (case-insensitive split), with leading `"Composition: "` prefix stripped |
| Composition text | Accordion body text **from** `"Analytical constituents:"` onwards (case-insensitive split) |

## Notes

- The `<details>` element has a dynamically generated UUID-based `id` — do **not** use it as a selector; it changes on Shopify theme re-deploys
- Use `summary h3.accordion__title` text matching to locate the correct panel (`"Composition"` vs `"Instructions"`)
- The accordion body is a single `<p>` block; ingredients and analytical data are separated by `<br><br>` in the HTML but appear as plain text when extracted via `.text()`
- The `"Analytical constituents:"` split point reliably separates the ingredients list from the rest of the composition data
