# Dibo — Selector Reference

**Homepage:** https://dibodog.com/  
**Scraper:** `dibo.ts`  
**Domain:** `dibodog.com`

## HTML Example

```html
<!-- Product hero block -->
<div class="bg-tertiary max-md:border-arch-b px-4 py-10 sm:px-8" style="background-color:#e5957f">
  <h1 class="text-center lg:text-7xl mb-4 text-5xl">Fresh Menu Beef</h1>

  <!-- Ingredients description (prose paragraph) -->
  <div class="font-serif md:text-xl text-base font-light leading-normal mb-6">
    <p>A gently cooked, beef-rich fresh menu with wholesome vegetables, vitamins &amp; minerals. Easy to digest and ideal for sensitive stomachs, just like homemade.</p>
  </div>
</div>

<!-- Expandable details sections -->
<div class="flex flex-col max-w-3xl mx-auto">

  <!-- Dish Composition -->
  <details class="py-4 border-b border-secondary-900 group">
    <summary class="flex gap-4 items-center cursor-pointer marker:content-none md:text-3xl text-xl">
      <h4 class="mr-auto">Dish Composition</h4>
    </summary>
    <ul class="py-4 font-serif md:text-xl text-light list-disc pl-8">
      <li>67% Beef</li>
      <li>Rice</li>
      <li>5.2% Carrot</li>
      <li>5.2% Broccoli</li>
      <li>3.2% Chicory</li>
      <li>Minerals</li>
      <li>Apple</li>
      <li>Hemp oil</li>
      <li>Salmon oil</li>
    </ul>
  </details>

  <!-- Nutritional Breakdown -->
  <details class="py-4 border-b border-secondary-900 group">
    <summary class="flex gap-4 items-center cursor-pointer marker:content-none md:text-3xl text-xl">
      <h4 class="mr-auto">Nutritional Breakdown</h4>
    </summary>
    <dl class="py-4 font-serif md:text-xl text-light gap-x-4 grid grid-cols-[auto_1fr]">
      <dt>Ash</dt><dd>3.07%</dd>
      <dt>Crude fibre</dt><dd>2.0%</dd>
      <dt>Crude oils and fats</dt><dd>10.10%</dd>
      <dt>Crude protein</dt><dd>10.95%</dd>
      <dt>Moisture</dt><dd>61.27%</dd>
    </dl>
  </details>

</div>
```

## Selector Table

| Field | Selector | Notes |
|---|---|---|
| Title | `$('h1').first()` | Only `h1` on the page; no scope needed |
| Ingredients description | `$('div.font-serif p').first()` | Prose paragraph in the hero block; falls back to Dish Composition `li` items if empty |
| Dish Composition block | `$('details')` whose `summary h4` text equals `"dish composition"` (case-insensitive) | Matched by heading text, not position |
| Composition ingredient list | `li` elements inside the matched Dish Composition `<details>` | Joined with `\n` |
| Nutritional Breakdown block | `$('details')` whose `summary h4` text equals `"nutritional breakdown"` (case-insensitive) | Matched by heading text |
| Analytical constituents | `dt`/`dd` pairs inside the matched Nutritional Breakdown `<details> dl` | Formatted as `"<dt>: <dd>"` per pair, joined with `\n` |

## Extraction Logic

1. **Title** — `$('h1').first().text().trim()`
2. **Ingredients description** — `$('div.font-serif p').first().text().trim()`; if empty, fall back to `li` text items from the Dish Composition `<details>` block, joined with `\n`
3. **Locate Dish Composition block** — iterate `$('details')`; match where `$(el).find('summary h4').first().text().trim().toLowerCase() === 'dish composition'`
4. **Composition text (ingredient list)** — collect all `li` text items inside the matched Dish Composition block, joined with `\n`
5. **Locate Nutritional Breakdown block** — iterate `$('details')`; match where heading text (lowercased) equals `'nutritional breakdown'`
6. **Composition text (analytical)** — collect parallel `dt`/`dd` pairs from the `dl` inside the Nutritional Breakdown block; format each as `"<dt>: <dd>"`; append after ingredient list separated by a blank line

## Notes

- `<details>` open/closed state is not reflected in the static HTML served — heading text matching is the only reliable approach
- The `div.font-serif` prose block is only present on "fresh menu" style products; freeflow meat products may omit it, triggering the fallback to the Dish Composition list
- Other `<details>` sections (Feeding guide, How to store, Find us in store) are intentionally ignored
