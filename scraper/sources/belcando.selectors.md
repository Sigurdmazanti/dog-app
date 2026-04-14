# Belcando — Selector Reference

**Homepage:** https://www.belcando.com/  
**Scraper:** `belcando.ts`  
**Domain:** `belcando.com`

## HTML Example

```html
<div class="product-detail-name-container">
  <span class="product-detail-name-manufacturer">Vetline</span>
  <h1 class="product-detail-name" itemprop="name">Weight Control</h1>
</div>

<div class="product-detail-analyse-text">
  <div class="row mb-3">
    <div class="col-md">
      <strong class="d-block mb-2 mb-md-3 mt-md-0">Composition</strong>
      Fresh duck meat (40%); Duck protein (18%); Amaranth (17%); Potato starch;
      Pea flour; Marine zooplankton (Krill) (2.5%); Grape pips expeller;
      Brewers' yeast, inactivated (2.5%); Kibbled carob (2.5%); Poultry fat;
      Dicalcium phosphate; Chia seed; Yeasts; Dried beet pulp; Sodium chloride;
      Potassium chloride; Herbs (0.2%)
    </div>
    <div class="col-md">
      <strong class="d-block mb-2 mb-md-3 mt-md-0 mt-3">Analytical constituents</strong>
      Protein 25%; Fat content 14%; Crude ash 7.5%; Crude fibre 3.2%;
      Moisture 10%; Calcium 1.5%; Phosphorus 1%; Sodium 0.3%
    </div>
    <div class="col-md">
      <strong class="d-block mb-2 mb-md-3 mt-md-0 mt-3">Additives per kg</strong>
      <div>
        <strong>Nutritional additives</strong><br>
        Vitamin A 15,000 IU; Vitamin D3 1,500 IU; Vitamin E 150 mg;
        Taurine 500 mg; Copper 12.5 mg; Iron 200 mg; Manganese 40 mg;
        Zinc 125 mg; Iodine 2 mg; Selenium 0.05 mg
      </div>
      <div class="mt-2">
        <strong>Technological additives</strong><br>
        Tocopherol extracts from vegetable oils 48 mg
      </div>
    </div>
  </div>
</div>
```

## Selectors

| Field | Selector / Approach |
|---|---|
| Title | `span.product-detail-name-manufacturer` (first, trimmed) + `h1.product-detail-name` (first, trimmed), non-empty parts joined with a single space |
| Ingredients description | `.product-detail-analyse-text .row.mb-3 > .col-md` whose first `<strong>` child text is `Composition` — clone element, remove `<strong>` label, call `.text().trim()` |
| Analytical constituents | Same column-matching approach with label `Analytical constituents` |
| Additives | Same column-matching approach with label `Additives per kg` |

## Notes

- Product URLs use a hash slug: `https://www.belcando.com/detail/<hash>`
- **Title concatenation**: `$('.product-detail-name-manufacturer').first().text().trim()` and `$('h1.product-detail-name').first().text().trim()` are collected, empty strings filtered out, then joined with `' '`. When the manufacturer span is absent (e.g. older product pages that predate the split layout), the result is just the `h1` text.
- **Column matching strategy**: iterate `.product-detail-analyse-text .row.mb-3 > .col-md`; for each column, check `.children('strong').first().text().trim()` against the target label. This is robust to column reordering.
- **Label removal**: clone the `.col-md`, call `.children('strong').first().remove()` on the clone, then `.text().trim()` to get the content without the heading label
- The "Additives per kg" column contains nested `<strong>` elements ("Nutritional additives", "Technological additives") inside `<div>` children — these are not direct `strong` children of `.col-md` so they are not affected by the label-removal step and appear in the extracted text
- The `extractCompositionText` callback combines `ingredientsDescription`, analytical constituents, and additives (joined with `\n`), providing the full nutritional profile for AI composition mapping
