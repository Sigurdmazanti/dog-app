# Carnilove — Selector Reference

**Homepage:** https://carnilove.com/en/
**Scraper:** `carnilove.ts`
**Domain:** `carnilove.com`

## HTML Example

```html
<h1 class="heading heading_justify-center h2" data-astro-cid-gqmf3xm5 data-astro-cid-icdb6gpr>
  <span class="heading__text" data-astro-cid-icdb6gpr>TRUE FRESH Duck Dry food for Large Breeds</span>
</h1>

<tray-component class="tray" data-tray-id="tray-ingredients">
  <div class="tray__wrapper">
    <div class="tray__content">
      <div class="product-info-card__tray-content">
        <div>
          <p><span>Fresh duck (60%), yellow peas, beef fat (4%), ...</span></p>
        </div>
      </div>
    </div>
  </div>
</tray-component>

<tray-component class="tray" data-tray-id="tray-nutrition">
  <div class="tray__wrapper">
    <div class="tray__content">
      <div class="product-info-card__tray-content">
        <div>
          <p><span>Crude protein 27.0%, crude fat 15.0%, ...</span></p>
          <p><span><strong>Nutritional additives per 1 kg:</strong></span></p>
          <p><span>Vitamin A (3a672a) 20,000 IU, ...</span></p>
          <p><span>3,630 kcal/kg</span></p>
        </div>
      </div>
    </div>
  </div>
</tray-component>
```

## Selectors

| Field | Selector / Approach |
|---|---|
| Title | `h1 .heading__text` → `.text().trim()` |
| Ingredients | `tray-component[data-tray-id="tray-ingredients"] .tray__content` → `.text().trim()` |
| Composition | Ingredients description + `tray-component[data-tray-id="tray-nutrition"] .tray__content` → `.text().trim()`, joined by `\n` |

## Notes

- The site is built with **Astro** and uses `data-astro-cid-*` attributes on most elements. These are build-generated hashes and **must not** be used in selectors — they change on each deployment.
- Content sections use `<tray-component>` custom elements with stable `data-tray-id` attributes (`tray-ingredients`, `tray-nutrition`, `tray-feeding-guide`).
- Ingredients and nutrition text are nested inside `.tray__content > .product-info-card__tray-content > div > p > span`. Using `.tray__content` as the entry point is sufficient since `.text()` collects all descendant text.
- Nutrition data spans multiple `<p>` elements: analytical constituents, nutritional additives, and energy (kcal/kg).
