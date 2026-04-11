# Acana US — Selector Reference

**Homepage:** https://www.acana.com/en-US/dogs/dog-food  
**Scraper:** `acana-us.ts`  
**Domain:** `www.acana.com`

## HTML Example

```html
<h3 aria-level="1" class="product-name show-desktop" role="heading">
  Free-Run Poultry Recipe
  <div class="mt-2 pdp-family" style="font-size:20px">
    <span>Dry Dog Food</span>
  </div>
</h3>

<div class="acana-container container ingredients" id="section2">
  <div class="ingredients-list">
    <h2>Composition</h2>
    <p>COMPOSITION: Fresh chicken (17%), chicken meal (15%), ...</p>
    <p>ADDITIVES (per kg) ...</p>
    <p>Metabolizable Energy is 3800 kcal/kg ...</p>
  </div>
  <div class="analysis">
    <h2>Analytical Constituents</h2>
    <ul>
      <li>Crude protein <span>31%</span></li>
      <li>Fat content <span>17%</span></li>
    </ul>
  </div>
</div>
```

## Selectors

| Field | Selector |
|---|---|
| Title | `h3.product-name.show-desktop` (text nodes only, excludes child elements) |
| Ingredients description | `.ingredients-list p` (first `<p>` only) |
| Composition text | `.ingredients-list p` (all except first) + `.analysis` full text |

## Notes

- Same HTML structure and selectors as `acana-eu` — different domain only
- URL-encodes special characters: `%2C` for commas, `%27` for apostrophes, `%C3%A2t%C3%A9` for "pâté"
- Covers dry, wet (pâté/chunks), treats (jerky bites, chewy strips), and freeze-dried (morsels, patties)
