# Alpha Spirit — Selector Reference

**Homepage:** https://alphaspirit.se/

## Notes

alphaspirit.se is a WordPress/WooCommerce store built with the Elementor page builder. Elementor generates instance-specific positional class names (e.g. `elementor-element-6276d71`) that change whenever a page is rebuilt in the editor. **Do not use these classes as selectors.** Only use tag names and stable Elementor semantic classes (e.g. `elementor-heading-title`).

All product content is in Swedish. Section headings are matched by text content:
- `"Sammansättning"` — ingredients / composition
- `"Analys"` — analytical constituents

## Representative HTML Snippet

```html
<h1 class="elementor-heading-title">Alpha Spirit The Only One 7 Days Formula</h1>

<!-- ... product description ... -->

<h3>Sammansättning</h3>
<p>85% färskt kött och vit fisk (45% färsk gris, 25% färsk kyckling, 10% färsk vildfångad vit fisk,
5% spädgrislever), hydrolyserad stärkelse*, ägg, betmassa*, öljäst*, sötpotatis, kokbanan,
kummin, spiskummin, salvia, gurkmeja och ingefära.</p>

<h3>Analys</h3>
<p>Protein 29,5%<br>Fett 15%<br>Aska 8%*<br>Växttråd 2%*<br>Omega-3 fettsyror (EPA/DHA) 2000 mg/kg<br>
Kalcium 1,5%<br>Fosfor 1,2%<br>Järn 70 mg/kg<br>Glukosamin 4400 mg/kg<br>Taurin 3000 mg/kg</p>
```

## Selectors

| Field | Selector / Method | Notes |
|---|---|---|
| Title | `h1.elementor-heading-title` | First `h1` with this class; the only `h1` on product pages |
| Ingredients description | `h3` where `text().trim() === "Sammansättning"` → `.next('p')` | Text-matched traversal; stable against Elementor layout rebuilds |
| Composition / Analytical constituents | `h3` where `text().trim() === "Analys"` → `.next('p')` | `<br>`-delimited nutrient lines; base runner normalises these |

## Extraction Logic

1. **Title** — select `h1.elementor-heading-title`, take `.first()`, return `.text().trim()`
2. **Ingredients description** — iterate all `h3` elements; when trimmed text equals `"Sammansättning"`, return `.next('p').text().trim()`; return `""` if heading not found
3. **Composition text** — iterate all `h3` elements; when trimmed text equals `"Analys"`, return `.next('p').text().trim()`; return `""` if heading not found

## Gotchas

- Elementor auto-generates positional classes per widget instance (e.g. `elementor-element-6276d71`). These are **not stable** — never target them.
- The `<p>` under "Analys" uses `<br>` tags between nutrient lines rather than separate elements. The base runner handles `<br>` normalisation during parsing.
- Footnote markers (`*`) appear inline in both sections. The base runner strips these during nutritional value extraction.
- Cat product URLs (paths containing `/kattmat-`) should be excluded from the source JSON — they are not relevant and the user has listed them in `needsReview` or excluded them entirely.
