# Eukanuba Selector Reference

## Site Overview

- **Domain:** `eukanuba.eu`
- **Product pages:** Server-rendered HTML (no SPA framework). Accordion panels are present in the static HTML response — Cheerio can extract their content directly without JavaScript execution.
- **Listing pages:** Use Alpine.js (`@click=showMore()`) for load-more pagination. Static HTML fetches only see the first batch of products (~20). All known product URLs are pre-populated in the source JSON.

---

## HTML Snippets

### Product Title

```html
<h1 class="text-text font-black text-left uppercase hyphens-auto leading-[1.2] text-6xl-clamp text-center text-theme-secondary tracking-[-2%]">
  <span>Special Care Sensitive Skin Adult All Breed</span>
</h1>
```

### Ingredients Accordion

```html
<ui-accordion>
  <button
    aria-controls="Ingredients"
    aria-expanded="true"
    data-accordion-header=""
    id="Ingredients"
    tabindex="1"
  >
    <span class="text-text font-black text-left uppercase text-lg">Ingredients</span>
  </button>
  <div
    data-accordion-content=""
    id="Ingredients"
    class="grid border-b-1 ..."
  >
    <div class="overflow-hidden">
      <div class="space-y-4">
        <p>maize, fish meal (24%), pork fat, dried beet pulp (2.9%), fish gravy, minerals (including sodium hexametaphosphate 0.38%), brewer's dried yeast (a natural source of B-vitamins and selenium), fructooligosaccharides (0.28%, a natural prebiotic).</p>
        <p>protein: 22%, fat content: 14%, omega-6 fatty acids: 2.2%, omega-3 fatty acids: 0.6%, crude ash: 6.4%, crude fibre: 2%, calcium: 0.9%, phosphorus: 0.8%.</p>
        <p><strong>^(/kg), Vitamins: </strong>vitamin A: 15000IU, vitamin D<sub>3</sub>: 1500IU, ...</p>
      </div>
    </div>
  </div>
</ui-accordion>
```

### Load More Button (listing pages — not scrapeable via static fetch)

```html
<div @click="showMore()" x-show="paginatedProductIds.length < matchingProductIds.length">
  <button>
    <span class="button-slanted" data-label="Load more">
      <span class="button-txt">Load more</span>
    </span>
  </button>
</div>
```

---

## Selector Table

| Field | Selector | Notes |
|---|---|---|
| Product title | `h1 span` | First span inside the h1; `.first().text().trim()` |
| Ingredients accordion content | `[data-accordion-content][id="Ingredients"]` | Present in static HTML even when visually collapsed |
| Ingredients description (first `<p>`) | `[data-accordion-content][id="Ingredients"] p:first-of-type` | Raw ingredients list |
| All composition paragraphs | `[data-accordion-content][id="Ingredients"] p` | Iterate with `.each()`, join with `\n` |
| Product link (listing page) | `section.content-container [data-product-item] > a` | Used in `discovery.productLinkSelector`; only first-page products visible in static HTML |

---

## Extraction Logic

1. **Title** — Select `h1 span`, take `.first().text().trim()`
2. **Ingredients description** — Select `[data-accordion-content][id="Ingredients"]`, find the first `<p>`, return its `.text().trim()`. Returns empty string if the accordion div is absent.
3. **Composition text** — Select the same accordion content div, iterate all `<p>` elements with `.each()`, collect non-empty `.text().trim()` values, join with `\n`. This captures the ingredients list, analytical constituents, and vitamin/additive block in order.

---

## Gotchas

- The `id="Ingredients"` attribute appears on **both** the `<button>` (header) and the `<div>` (content). The selector `[data-accordion-content][id="Ingredients"]` targets the content div specifically.
- The `<ui-accordion>` is a custom element — Cheerio treats it as a generic HTML node and traverses its children normally.
- Listing pagination is Alpine.js-driven (`showMore()`). Static Axios fetches cannot trigger it. Discovery will only return the first ~20 products per listing page. All known product URLs are pre-populated in `eukanuba.json` to work around this.
