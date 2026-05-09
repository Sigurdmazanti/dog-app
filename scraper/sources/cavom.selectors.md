# Cavom — Selector Reference

**Homepage:** https://www.cavom.com/  
**Scraper:** `cavom.ts`  
**Domain:** `cavom.com`

## HTML Example

```html
<h1 class="entry-title product_title">Compleet Sport</h1>

<!-- Tab blocks (WordPress/WooCommerce custom template) -->
<div class="o-productMeta__inner u-bgBlack u-cWhite u-containerMediumLarge">

  <!-- Description tab -->
  <div class="m-productTab">
    <div class="js-productTab m-productTab__title">
      <h2>Description</h2>
      <div class="m-productTab__icon"></div>
    </div>
    <div class="m-productTab__content">
      <div class="m-productTab__contentInner">
        <div class="-headingsBlack m-productTab__text u-wysiwyg">
          <p>Cavom <strong>Compleet Sport</strong> is a complete pressed diet for adult dogs...</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Composition tab (active) -->
  <div class="m-productTab">
    <div class="js-productTab m-productTab__title -active">
      <h2>Composition</h2>
      <div class="m-productTab__icon"></div>
    </div>
    <div class="m-productTab__content">
      <div class="m-productTab__contentInner">
        <div class="-headingsBlack m-productTab__text u-wysiwyg">
          <p><strong>Composition</strong></p>
          <p>Beef*, gelatinized maize, gelatinized wheat, beef fat, turkey*, lamb*, ground chicory root (source of inulin), di-calcium phosphate, rapeseed oil, minerals, salmon oil (1.2%), vegetable fibres, krill, yeast (postbiotics), glucosamine (2000 mg/kg).<br>(*dried)</p>
          <p><strong>Analytical Constituents</strong></p>
          <p>Crude protein 31.5%, crude fat 18%, crude fibre 1.9%, crude ash 7%, moisture 7%, phosphorus 0.8%, calcium 1%, sodium 0.3%.</p>
          <p><strong>Nutritional Additives</strong></p>
          <p>Vitamin A 22,400 IU/kg, Vitamin D3 2,240 IU/kg, Vitamin E 350 mg/kg, Vitamin B12 0.060 mg/kg, iron (iron sulphate monohydrate) 150 mg/kg, zinc (zinc oxide) 120 mg/kg, manganese (manganese sulphate monohydrate) 30 mg/kg, copper (copper sulphate pentahydrate) 8 mg/kg, iodine (potassium iodide) 1.5 mg/kg, selenium (sodium selenite) 0.2 mg/kg.</p>
        </div>
      </div>
    </div>
  </div>

</div>
```

## Selectors

| Field | Selector | Notes |
|---|---|---|
| Title | `h1.entry-title.product_title` | Trimmed text content |
| Composition tab | `div.m-productTab` where `.m-productTab__title h2` text equals `"Composition"` (case-insensitive) | Iterate all tab blocks; match by heading text, not by `-active` class (UI state) |
| Tab text body | `.m-productTab__text` (inside matched tab) | Contains all sub-sections as sibling `<p>` elements |
| Sub-section heading | `<p>` whose full text equals its contained `<strong>` text | e.g. `<p><strong>Composition</strong></p>` — signals start of a new sub-section |
| Ingredients description | Paragraphs following `<strong>Composition</strong>` heading | Stop at next `<p><strong>…</strong></p>` heading marker |
| Analytical constituents | Paragraphs following `<strong>Analytical Constituents</strong>` heading | Stop at next heading marker |
| Nutritional additives | Paragraphs following `<strong>Nutritional Additives</strong>` heading | Stop at next heading marker or end of content |

## Extraction Logic

1. **Title** — `$('h1.entry-title.product_title').first().text().trim()`
2. **Locate Composition tab** — iterate `$('div.m-productTab')`; for each, read `.m-productTab__title h2` text; match `=== 'composition'` (lowercased); take `.m-productTab__text` of the matched tab
3. **Sub-section splitting** — walk `.m-productTab__text` children; treat any `<p>` element whose trimmed text equals its inner `<strong>` text as a heading marker; accumulate following paragraph text until the next heading marker
4. **Ingredients description** — text collected under the `"Composition"` heading marker
5. **Composition text** — text collected under `"Analytical Constituents"` + `"\n"` + text collected under `"Nutritional Additives"`

## Notes

- The `-active` modifier class on `.m-productTab__title` reflects open/closed UI state and is not a reliable selector — always match by `h2` heading text
- Sub-section heading paragraphs in the source HTML may appear as bare `<p>Composition</p>` (Cheerio normalises the unclosed tags from the raw markup)
- The "Nutritional advice" tab is intentionally ignored — it contains feeding calculator widgets, not nutritional data
