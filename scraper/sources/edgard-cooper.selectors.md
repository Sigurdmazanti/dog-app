# Edgard & Cooper — Selector Reference

## Overview

Edgard & Cooper uses Next.js App Router with React Server Components. Product data (composition, analytical constituents, additives) is **not** in the server-rendered HTML elements — it is embedded in `self.__next_f.push` script tags as a double-escaped RSC payload string. The HeadlessUI Disclosure panels are collapsed server-side (`aria-expanded="false"`) and their content is absent from the static HTML.

## Representative HTML (product title only in HTML)

```html
<!-- Product title — the only product field reliably in the HTML -->
<h1 class="font-imperfect font-medium leading-tight mb-0 text-3xl text-[var(--product-text)]">
  Fresh Chicken
</h1>

<!-- Disclosure panels are collapsed; content is NOT in the DOM -->
<button aria-expanded="false" data-headlessui-state="" type="button">
  Composition<span>...</span>
</button>
```

## RSC Payload Script Structure

The product data lives in a `self.__next_f.push([1, "..."])` script tag.
The content is a double-escaped JSON string containing these keys:

| Key | Content | Maps to |
|---|---|---|
| `composition` | Ingredient list | `ingredientsDescription` |
| `analyticalConstituents` | Crude protein/fat/fibre/ash etc. | part of `compositionText` |
| `nutritionalAdditives` | Vitamins, minerals, etc. | part of `compositionText` |
| `technologicalAdditives` | Antioxidants, preservatives, etc. | part of `compositionText` |

## Selector Table

| Field | Strategy | Notes |
|---|---|---|
| Title | `h1.font-imperfect` (first) | Stable utility class |
| Ingredients | `\"composition\":\"<value>\"` in `self.__next_f` script | Value ends at next `\"` |
| Analytical | `\"analyticalConstituents\":\"<value>\"` | Same extraction pattern |
| Nutri additives | `\"nutritionalAdditives\":\"<value>\"` | Same extraction pattern |
| Tech additives | `\"technologicalAdditives\":\"<value>\"` | Same extraction pattern |
| Product link (discovery) | `.container div.grid > a` | Used by batch scraper |

## Extraction Logic

1. **Title**: `$('h1.font-imperfect').first().text().trim()`
2. **Ingredients**: iterate `$('script')`, find the script containing `\"composition\":\"`, extract the string value between marker and closing `\"`.
3. **compositionText**: extract `analyticalConstituents`, `nutritionalAdditives`, `technologicalAdditives` the same way; join non-empty values (plus `ingredientsDescription`) with `\n`.
4. The AI mapper receives the full `compositionText` and parses nutrition values; it also returns `ingredientsDescriptionEnglish` which overrides the raw ingredient text if present.

## Gotchas

- **No `__NEXT_DATA__` tag**: The page uses the newer App Router streaming format, not the classic `__NEXT_DATA__` JSON blob.
- **Double-escaped values**: Keys appear as `\"composition\"` (backslash + quote) in the raw script `.html()` output because the string is embedded inside a JS string literal.
- **First match wins**: `extractNextFValue` stops at the first script containing the key. On product pages this is always the target product's data. On listing pages this approach would not be appropriate.
- **Nutritional additives may be `"/"`** for treats products (separator artefact) — filter with `.trim().length > 0` handles this gracefully.

