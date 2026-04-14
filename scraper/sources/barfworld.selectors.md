# Barf World — Selector Reference

**Homepage:** https://barfworld.com/  
**Scraper:** `barfworld.ts`  
**Domain:** `barfworld.com`

## HTML Example

```html
<h1 class="product-title title">E-BARF Plus</h1>

<dl class="accordion-icon--carets faq-accordion">
  <dt>
    <button aria-controls="panel-description" class="accordion__button" type="button">
      Description
    </button>
  </dt>
  <dd id="panel-description" style="display:none">
    <div class="content">
      <div class="metafield-rich_text_field">
        <p>If your dog suffers from digestive problems...</p>
      </div>
    </div>
  </dd>

  <dt>
    <button aria-controls="panel-ingredients" class="accordion__button" type="button">
      Ingredients
    </button>
  </dt>
  <dd id="panel-ingredients" style="display:block">
    <div class="content">
      <div class="metafield-rich_text_field">
        <p>Organic Dried Kelp, Organic Dehydrated Alfalfa Meal, Brewers Dried Yeast, ...</p>
      </div>
    </div>
  </dd>

  <dt>
    <button aria-controls="panel-guaranteed-analysis" class="accordion__button" type="button">
      Guaranteed Analysis
    </button>
  </dt>
  <dd id="panel-guaranteed-analysis" style="display:block">
    <div class="content">
      <div class="metafield-rich_text_field">
        <ul>
          <li>Crude Protein - minimum 18.00%</li>
          <li>Crude Fat - minimum 5.00%</li>
          <li>Crude Fiber - maximum 35.00%</li>
          <li>Moisture - maximum 10.00%</li>
        </ul>
      </div>
    </div>
  </dd>
</dl>
```

## Selectors

| Field | Selector |
|---|---|
| Title | `h1.product-title.title` |
| Ingredients description | `#panel-ingredients .metafield-rich_text_field p` (first) |
| Analytical constituents | `#panel-guaranteed-analysis .metafield-rich_text_field li` (all, joined with `; `) |
