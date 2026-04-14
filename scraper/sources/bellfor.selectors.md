# Bellfor — Selector Reference

**Homepage:** https://uk.bellfor.info/  
**Scraper:** `bellfor.ts`  
**Domain:** `bellfor.info`

## HTML Example

```html
<h1 class="product-page-heading">Hypoallergenic Wet food for dogs with insect protein - grain-free - Naturfarm-Menü by Bellfor Dog Food - 800 g</h1>

<ul class="nav nav-tabs product-tabs-buttons" role="tablist">
  <li role="presentation" class="active">
    <a href="#tab_79483" role="tab" data-toggle="tab">Ingredients</a>
  </li>
  <li role="presentation">
    <a href="#tab_79484" role="tab" data-toggle="tab">Additives</a>
  </li>
  <li role="presentation">
    <a href="#tab_79485" role="tab" data-toggle="tab">Nutrient analysis</a>
  </li>
  <li role="presentation">
    <a href="#tab_79486" role="tab" data-toggle="tab">Feeding advice</a>
  </li>
</ul>

<div class="product-tabs-contents tab-content">
  <div class="tab-pane active" id="tab_79483" role="tabpanel">
    <p>Insects (black soldier fly) 61 %, lentils 2 %, carrots 2 %, tapioca starch 2 %,
    blueberries 2 %, minerals, linseed oil 0.1 %, rosemary, oregano</p>
  </div>
  <div class="tab-pane" id="tab_79484" role="tabpanel">
    <!-- Additives table or text -->
  </div>
  <div class="tab-pane" id="tab_79485" role="tabpanel">
    <!-- Nutrient analysis table or text -->
  </div>
  <div class="tab-pane" id="tab_79486" role="tabpanel">
    <!-- Feeding advice (not extracted) -->
  </div>
</div>
```

## Selectors

| Field | Selector / Approach |
|---|---|
| Title | `h1.product-page-heading` — `.first().text().trim()` |
| Ingredients description | Match `.product-tabs-buttons a[href]` whose text matches `/ingredients/i` → follow `href` to pane ID → `.text().trim()` |
| Additives | Match tab label `/additives/i` → follow `href` to pane ID → `.text().trim()` |
| Nutrient analysis | Match tab label `/nutrient/i` → follow `href` to pane ID → `.text().trim()` |

## Notes

- **Tab IDs are dynamic** (`tab_79483`, `tab_79484`, …) and differ per product — never use them directly. Always resolve via the nav label → `href` → pane ID lookup.
- **Tab order varies** between products. Label-based matching is the only reliable approach.
- **`findTabContent` helper**: iterates `.product-tabs-buttons a[href]`, tests label text against a `RegExp`, slices the `#` from the `href`, then returns `$(`#${tabId}`).text()` normalised with `replace(/\s+/g, ' ').trim()`.
- **Composition text** passed to the AI mapper is the concatenation of Ingredients, Additives, and Nutrient analysis tab text (non-empty sections joined with `\n`). The AI handles structural variation.
