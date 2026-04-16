# Bosch — Selector Reference

**Homepage:** https://www.bosch-tiernahrung.de/  
**Scraper:** `bosch.ts`  
**Domain:** `bosch-tiernahrung.de`

## HTML Example

```html
<div class="product-brand-name">
  <a href="https://www.bosch-tiernahrung.de/bosch_de_en/dog-food/brands/bosch-hpc-soft-plus.html">
    bosch HPC Soft / Plus
  </a>
</div>

<h1 class="font-bold hidden lg:block typo-h1">Junior Chicken & Sweet Potato</h1>

<ul class="tabs-label-list" role="tablist">
  <li class="tabs-list-item" role="presentation">
    <a href="#" aria-controls="tabpanel1" id="tab1" role="tab" tabindex="-1">Description</a>
  </li>
  <li class="tabs-list-item" role="presentation">
    <a href="#" aria-controls="tabpanel2" id="tab2" role="tab" tabindex="-1">Composition</a>
  </li>
  <li class="tabs-list-item" role="presentation">
    <a href="#" aria-controls="tabpanel3" id="tab3" role="tab" tabindex="-1">Feeding recommendation</a>
  </li>
  <li class="tabs-list-item" role="presentation">
    <a href="#" aria-controls="tabpanel4" id="tab4" role="tab" tabindex="-1">Analytical components</a>
  </li>
  <li class="tabs-list-item" role="presentation">
    <a href="#" aria-controls="tabpanel5" id="tab5" role="tab" tabindex="0">Supplements</a>
  </li>
</ul>

<!-- Composition tabpanel -->
<div class="tabs-content" id="tabpanel2" role="tabpanel">
  Fresh chicken (70 %), sweet potato (dried, 10 %), potato flour, potato protein, ...
</div>

<!-- Analytical components tabpanel -->
<div class="tabs-content" id="tabpanel4" role="tabpanel">
  Moisture 19.0 %, convertible energy 349 kcal/100 g (14.61 MJ/kg), protein 24.0 %, fat content 16.0 %, ...
</div>

<!-- Supplements tabpanel -->
<div class="tabs-content" id="tabpanel5" role="tabpanel">
  <p><strong>Nutritional additives per kg</strong><br>
  Vitamin A 15,000 I.U., vitamin D3 1,200 I.U., ...</p>
  <p><strong>Trace elements per kg</strong><br>
  Zinc (as amino acid zinc chelate hydrate) 45 mg, ...</p>
  <p><strong>Technological additives</strong><br>Antioxidant, preservatives.</p>
  <p><strong>Other</strong><br>Proportion of meat or protein carriers of animal origin: 73.70 %.</p>
</div>
```

## Selectors

| Field | Selector / Approach |
|---|---|
| Brand / sub-brand title | `div.product-brand-name a` (first match, trimmed text) |
| Variant name | `h1` (first match, trimmed text) |
| Composed title | brand link text + `h1` text joined with a space; falls back to `h1` alone when brand link is absent |
| Composition tabpanel | `[role=tab]` whose `.text().trim()` equals `"Composition"`, read `aria-controls`, then select `[id="<value>"]` |
| Ingredients description | full `.text().trim()` of the Composition tabpanel |
| Analytical components tabpanel | `[role=tab]` whose `.text().trim()` equals `"Analytical components"`, read `aria-controls`, then select `[id="<value>"]` |
| Supplements tabpanel | `[role=tab]` whose `.text().trim()` equals `"Supplements"`, read `aria-controls`, then select `[id="<value>"]` |
| Analytical constituents | full `.text().trim()` of the Analytical components tabpanel, with Supplements tabpanel text appended (newline-separated) when present |
