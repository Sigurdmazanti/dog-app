# Acana EU — Selector Reference

**Homepage:** https://emea.acana.com/en/homepage  
**Scraper:** `acana-eu.ts`  
**Domain:** `emea.acana.com`

## HTML Example

```html
<h3 aria-level="1" class="product-name show-desktop" role="heading">
  Adult Dog Recipe
  <div class="mt-2 pdp-family" style="font-size:20px">
    <span>Dry Dog Food</span>
  </div>
</h3>

<div class="acana-container container ingredients" aria-labelledby="tab2" id="section2" role="tabpanel">
  <div class="ingredients-list">
    <h2>Composition</h2>
    <p>COMPOSITION: Fresh chicken (14%), chicken meal (14%), whole red lentils, ...</p>
    <p>ADDITIVES (per kg) ...</p>
    <p>Metabolizable Energy is 3510 kcal/kg ...</p>
  </div>
  <div class="analysis">
    <h2>Analytical Constituents</h2>
    <ul>
      <li>Crude protein <span>29%</span></li>
      <li>Fat content <span>17%</span></li>
      <li>Crude fibre <span>5%</span></li>
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

- Title element contains an inner `<div>` — use `.contents().filter(text nodes)` to exclude it
- Composition and analysis are both inside `.ingredients-list` / `.analysis` within `#section2`
- Same HTML structure as `acana-us` — scrapers are identical except for domain
