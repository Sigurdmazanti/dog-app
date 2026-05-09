# Chrisco — Selector Reference

**Homepage:** https://www.chrisco.dk/  
**Scraper:** `chrisco.ts`  
**Domain:** `chrisco.dk`

## HTML Example

```html
<h1 class="page-title" data-ui-id="page-title-wrapper" itemprop="name">Paw Knas, 7 kg ℮</h1>

<!-- Tab navigation (Amasty Tabs / Magento) -->
<div class="data item amtheme-item-title title active"
     data-role="collapsible"
     id="tab-label-amcustomtabs_tabs_12"
     role="tab"
     aria-controls="amcustomtabs_tabs_12">
  <a class="data switch"
     href="#amcustomtabs_tabs_12"
     id="tab-label-amcustomtabs_tabs_12-title">Næringsindhold</a>
</div>

<!-- Nutritional content panel (contains both composition and analytical constituents) -->
<div class="data item content"
     id="amcustomtabs_tabs_12"
     role="tabpanel"
     style="display:block">
  <div class="am-custom-tab am-custom-tab-12">
    <p><strong>Sammensætning:</strong><br>
    Forarbejdet animalsk protein (heraf 18 % kylling/6 % svin/2 % okse), majs, hvede, byg, ...</p>
    <p><strong>Analytiske bestanddele:</strong><br>
    Råprotein: 22,0 %, Råfedt: 12,0 %, Råaske: 7,5 %, Vand: 9,0 %, ...</p>
  </div>
</div>
```

## Selectors

| Field | Selector | Notes |
|---|---|---|
| Title | `h1.page-title` | Trimmed text content |
| Nutritional tab link | `a.data.switch` (text = `"Næringsindhold"`) | Locate by label text; read `href` attribute to get panel ID |
| Nutritional panel | `#<panelId>` (derived from tab link `href`) | Contains both composition (Sammensætning) and analytical constituents (Analytiske bestanddele) as a single text block |

## Extraction Logic

1. **Title** — `$('h1.page-title').first().text().trim()`
2. **Tab panel lookup** — iterate `$('a.data.switch')`, match by `.text().trim() === 'Næringsindhold'`, read `href` attribute and strip `#` to get panel ID
3. **Ingredients description** — `$('#<panelId>').text().trim()` (full panel text; AI mapper parses it downstream)
4. **Composition text** — same as ingredients description (single panel contains both composition and analytical data)
