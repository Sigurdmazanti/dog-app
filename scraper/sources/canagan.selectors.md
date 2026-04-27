# Canagan — Selector Reference

**Homepage:** https://canagan.com/  
**Scraper:** `canagan.ts`  
**Domain:** `canagan.com`

## HTML Example

```html
<h1 class="product-name">
  <div style="color:#40423f;font-size:80%;...;text-transform:uppercase">Dry Dog Food</div>
  <div style="font-size:105%;color:#3f8082;...;text-transform:uppercase">Small Breed<br>Light / Senior</div>
  <div style="color:#40423f;font-size:80%;...;text-transform:uppercase">For Adults</div>
</h1>

<div class="pd-region" id="ctl00_Content_...">
  <h4>COMPOSITION</h4>
  <p>Freshly Prepared Free Range Chicken (26%), Dried Chicken (26%), Sweet Potato, Peas,
     Potato, Chicken Fat (4.2%), Alfalfa, Dried Egg (3%), Chicken Gravy (1.5%),
     Salmon Oil (1.2%), Glucosamine (830 mg/kg), Apple, MSM (830 mg/kg), Carrot,
     Fructooligosaccharides, Spinach, Psyllium, Seaweed, Chondroitin Sulphate (610 mg/kg),
     Peppermint, Camomile, Marigold, Cranberry, Aniseed &amp; Fenugreek.</p>

  <h4>ANALYTICAL CONSTITUENTS</h4>
  <p>Crude Protein 34%, Crude Fat 17%, Crude Fibre 3%, Crude Ash 7%, Omega 6 2.8%,
     Omega 3 0.45%, Calcium 1.4%, Phosphorus 0.9%. Metabolisable Energy 391 kcal/100g.</p>

  <h4>NUTRITIONAL ADDITIVES (PER KG)</h4>
  <p><strong>Vitamins</strong><br>
     Vitamin A 15,000 IU, Vitamin D3 1,200 IU, Vitamin E 150 mg, Taurine 1,500 mg<br>
     <strong>Trace Elements</strong><br>
     Iodine (Calcium Iodate Anhydrous) 2 mg, Copper (Copper (II) Sulphate Pentahydrate) 10 mg,
     Zinc (Chelate Hydrate) 45 mg, Zinc (Oxide) 90 mg, Selenium (Sodium Selenite) 0.2 mg</p>
</div>
```

## Selectors

| Field | Selector / Approach |
|---|---|
| Product title | `h1.product-name div` — take index 1 (`eq(1)`), trimmed text. Skips the first div (food type label) and third div (life stage label). |
| Ingredients description | `div.pd-region h4` whose trimmed text equals `"COMPOSITION"`, then `.next('p').text().trim()` |
| Analytical constituents | `div.pd-region h4` whose trimmed text equals `"ANALYTICAL CONSTITUENTS"`, then `.next('p').text().trim()` |
| Nutritional additives | `div.pd-region h4` whose trimmed text equals `"NUTRITIONAL ADDITIVES (PER KG)"`, then `.next('p').text().trim()`; appended to analytical constituents (newline-separated) when present |
