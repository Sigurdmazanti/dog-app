# Zooplus — Selector Reference

**Homepage:** https://www.zooplus.com/  
**Scraper:** `zooplus.ts`  
**Domain:** `zooplus.com`

## HTML Example

```html
<h1>Acana Adult Dog</h1>

<div id="ingredients">
  <div class="anchors_anchorsHTML___2lrv">
    <p>Ingredienser: Frisk kylling (14%), kyllingemel (14%), ... Tilsætningsstoffer: ...</p>
  </div>
</div>

<table data-zta="constituentsTable">
  <tr><td>Råprotein</td><td>29%</td></tr>
  <tr><td>Råfedt</td><td>17%</td></tr>
  <tr><td>Råfiber</td><td>5%</td></tr>
</table>
```

## Selectors

| Field | Selector |
|---|---|
| Title | `h1` |
| Ingredients description | `#ingredients .anchors_anchorsHTML___2lrv p` (text before "Tilsætningsstoffer", stripped of "Ingredienser:" prefix) |
| Composition text | full ingredients text + `table[data-zta="constituentsTable"] tr` label/value pairs |

## Notes

- Page content may be in Danish (Zooplus locale-dependent)
- Ingredients text contains both ingredients and additives — split on "Tilsætningsstoffer" to isolate ingredient list
- No product URLs added yet — add to `zooplus.yaml` when products are identified
