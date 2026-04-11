# Antos — Selector Reference

**Homepage:** https://www.antos.eu/  
**Scraper:** `antos.ts`  
**Domain:** `antos.eu`

## HTML Example

```html
<h1 class="blackColor col-12 extraBoldFont lowercase ls-10 s-hide title-medium uppercase"
    itemprop="name">Antos Duck Gold 100 gr</h1>

<div class="col-12 active medium paragraph" id="specs">
  <strong>Composition</strong><br>
  Duck fillet, duck liver, glycerine<br><br>
  <strong>Analytical Constituents</strong><br>
  <table>
    <tr><td>Crude protein</td><td style="text-align:right">32.0%</td></tr>
    <tr><td>Crude fat</td><td style="text-align:right">5.0%</td></tr>
    <tr><td>Crude fibre</td><td style="text-align:right">1.0%</td></tr>
    <tr><td>Crude ash</td><td style="text-align:right">5.0%</td></tr>
    <tr><td>Moisture</td><td style="text-align:right">22.0%</td></tr>
  </table>
  <a class="col-12 fastLink skip-popup" href="/choose-the-right-source-of-protein/">
    <strong>Choose the right source of protein for your pet</strong>
  </a>
</div>
```

## Selectors

| Field | Selector |
|---|---|
| Title | `h1[itemprop="name"]` (text, trimmed) |
| Ingredients description | Text nodes inside `div#specs` between `<strong>Composition</strong>` and `<strong>Analytical Constituents</strong>` |
| Composition text | `div#specs table tr` — each row's two `<td>` cells formatted as `Label: value`, joined by `; ` |

## Notes

- URL pattern: `https://www.antos.eu/<product-slug>-<id>/`
- All nutritional content is inside a single `div#specs` block — no separate tabs or panels
- Ingredients text follows `<strong>Composition</strong>` as bare text nodes separated by `<br>` elements
- Analytical constituents are in a `<table>` with two columns (label left, value right)
- A promotional `<a>` tag follows the table and must not be included in extracted text
- The title `<h1>` has many volatile CSS classes — `itemprop="name"` is used as the stable selector
