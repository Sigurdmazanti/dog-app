# Canex — Selector Reference

**Homepage:** https://canex-shop.dk/
**Scraper:** `canex.ts`
**Domain:** `canex-shop.dk`

## HTML Example

```html
<h1 class="entry-title product-title product_title">Puppy-Junior Brocks 12 kg</h1>

<div class="product-short-description">
  <p><strong>HobbyFirst Canex Maxi Bones 500 g</strong></p>
  <p>Indhold: Korn, vegetabilske produkter, animalsk protein, olier, fedtstoffer og mineraler.</p>
  <p>Analyse: Vand (22,5%), råprotein (9%), fedt (5,5%), fibre (0,2%), råaske (2,8%)</p>
</div>

<div class="accordion">
  <div class="accordion-item" id="accordion-2730843933">
    <a class="accordion-title plain">
      <span>Sammensætning</span>
    </a>
    <div class="accordion-inner" id="accordion-2730843933-content">
      <p>Tørret kylling (25%), ris (21%), majs, animalsk fedt (kylling)...</p>
      <table>
        <tr><td>Råprotein</td><td>27%</td></tr>
        <tr><td>Råfedt</td><td>15%</td></tr>
        <tr><td>Råaske</td><td>5%</td></tr>
        <tr><td>Træstof (plantefibre)</td><td>2,8%</td></tr>
      </table>
    </div>
  </div>
</div>
```

## Selectors

| Field | Selector | Notes |
|---|---|---|
| Title | `h1.product-title` | Text, trimmed |
| Ingredients description (primary) | `.accordion-title span` containing "Sammensætning" → parent `.accordion-item` → `.accordion-inner` paragraphs before `<table>` | Used for dry food products with full accordion layout |
| Ingredients description (fallback) | `.product-short-description` | Used for treat products lacking the accordion section; extract text content from paragraphs before "Analyse:" |
| Composition table (primary) | `.accordion-inner table tr` | Each row's two `<td>` cells formatted as `label: value`, joined by `; ` |
| Composition inline (fallback) | `.product-short-description` text containing "Analyse:" | Parse inline analytical values for treats |

## Notes

- URL pattern: `https://canex-shop.dk/produkter/<product-slug>/`
- Site language is Danish; ingredient descriptions and analytical labels are in Danish
- Accordion items have dynamic IDs (`#accordion-*`); locate by matching the `<span>` text "Sammensætning" within `.accordion-title`
- Some treat products only have a `.product-short-description` with no accordion detail section
