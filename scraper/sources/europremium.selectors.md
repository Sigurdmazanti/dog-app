# EuroPremium Selectors

## Representative HTML

```html
<h1>Adult Light</h1>
<div class="product-components">
  <div class="product-components__container">
    <div class="product-components__title"
         san-id="expand-item"
         data-target="[san-id='open-Composition']"
         role="button">Composition</div>
    <div class="product-components__content" san-id="open-Composition">
      Rice (26%), dried chicken (20%), oats (14%), peas, chicken fat, beet pulp,
      hydrolyzed chicken protein, minerals, vegetable fiber, fish oil, brewer's
      yeast, yeast extracts (M.O.S., β-glucans (75 mg/kg)), collagen, G.O.S.,
      F.O.S., dried plants (40 mg/kg; Rosmarinus sp., Curcuma sp., Eugenia sp.),
      glucosamine, chondroitin sulphate.
    </div>
  </div>
  <div class="product-components__container">
    <div class="product-components__title"
         san-id="expand-item"
         data-target="[san-id='open-Analytical components']"
         role="button">Analytical components</div>
    <div class="product-components__content" san-id="open-Analytical components">
      Crude protein: 23,5% - fat content: 9,5% - crude fibre: 4% - crude ash: 7%
      - calcium: 1,4% - phosphor: 0,90%
    </div>
  </div>
</div>
```

## Selector Table

| Field                   | Selector                                                      | Notes                                                         |
|-------------------------|---------------------------------------------------------------|---------------------------------------------------------------|
| Title                   | `h1`                                                          | Single `<h1>` on each product page; `.first().text().trim()` |
| Ingredients description | `[san-id="open-Composition"]`                                 | Content panel identified by the `san-id` CMS attribute        |
| Composition text        | `[san-id="open-Analytical components"]`                       | Analytical data as a single text string; note the space       |

## Extraction Logic

1. **Title** — select the first `<h1>` and trim whitespace.
2. **Ingredients description** — select `[san-id="open-Composition"]` and return its trimmed text content (recipe/ingredient list). If absent, return empty string.
3. **Composition text (passed to AI)** — combine the ingredients description (step 2) with the trimmed text of `[san-id="open-Analytical components"]`, joined by `\n`, filtering empty values. The AI uses this combined text to parse nutritional data and identify the ingredient list.

## Notes

- The `san-id` attributes are set by the site CMS and are stable identifiers for each data panel.
- Panel content is server-rendered; no JavaScript execution required.
- The `data-target` attributes on the title elements are used for client-side expand/collapse — the content divs themselves are always present in the HTML.
- The analytical components value is a dash-separated string (e.g. `Crude protein: 23,5% - fat content: 9,5% - ...`); no further parsing is needed.
