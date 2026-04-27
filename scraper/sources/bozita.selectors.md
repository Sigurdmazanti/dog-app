# Bozita — Selector Reference

**Homepage:** https://bozita.com/  
**Scraper:** `bozita.ts`  
**Domain:** `bozita.com`

## HTML Example

```html
<h1 class=headline>ROBUR SENSITIVE SMALL WITH LAMB</h1>

<div class=product-detail>
  <h3 class=title>Ingredients</h3>

  <h5>COMPOSITION</h5>
  <p>Lamb 23% (dried lamb protein 13%, freshly prepared lamb 8%, hydrolysed lamb protein 2%),
     pea starch*, dried potato*, dried pork protein 13%, animal fat 10%, dried beet pulp*,
     vegetable oil, yeast*, minerals, glucosamine 0.05%, chondroitin sulphate 0.004%.
     *Natural ingredients</p>

  <h5>ADDITIVES (PER KG)</h5>
  <p>Nutritional additives: Vitamin A 18 000IU, Vitamin D3 1 000IU, Vitamin E 200mg,
     Vitamin C 300mg, taurine 1000mg, copper (copper(II)sulphate, pentahydrate) 6mg;
     manganese (manganese(II)oxide) 6mg; zinc (zincsulphate, monohydrate) 63mg;
     iodine (calcium iodate, anhydrous) 1.8mg; selenium (selenium yeast) 0,1mg.
     Technical additives: Antioxidants.</p>

  <h5>ANALYTICAL CONSTITUENTS</h5>
  <p>Protein 27%, fat content 17%, crude fibre 2.5%, crude ash 6%
     (of which calcium 1.2% and phosphorus 0.9%), omega 6 1.5%, omega 3 0.2%,
     moisture 9.5%. Metabolisable energy 1634kJ/100g.</p>
</div>
```

## Selectors

| Field | Selector / Approach |
|---|---|
| Product title | `h1.headline` (first match, trimmed text) |
| Ingredients description | `div.product-detail h5` whose trimmed text equals `"COMPOSITION"`, then `.next('p').text().trim()` |
| Additives | `div.product-detail h5` whose trimmed text equals `"ADDITIVES (PER KG)"`, then `.next('p').text().trim()` |
| Analytical constituents | `div.product-detail h5` whose trimmed text equals `"ANALYTICAL CONSTITUENTS"`, then `.next('p').text().trim()`; additives text appended (newline-separated) when present |
