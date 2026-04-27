# Brit — Selector Reference

**Homepage:** https://brit-petfood.com/  
**Scraper:** `brit.ts`  
**Domain:** `brit-petfood.com`

## HTML Example

```html
<h1 class="mt-1 title" itemprop="name">Brit Care Dog Hair &amp; Skin. Insect&amp;Fish</h1>

<p class="composition">
  <strong>Composition:</strong><br>
  insects dehydrated (14%), white fish dehydrated (14%), yellow peas (14%), green peas (14%),
  dried apple pulp, pea protein, coconut oil (8%), white fish protein hydrolyzed (4%),
  brewer´s yeast, salmon oil (2%), linseed (2%), egg shells, glucosamine (0.02%),
  chondroitin sulphate (0.015%), fructo-oligosaccharides (0.012%),
  mannan-oligosaccharides (0.012%), Mojave yucca (0.01%), inulin (0.009%),
  dried milk thistle (0.005%), dried rosemary (0.005%), dried cloves (0.005%),
  dried citrus (0.005%), dried curcuma (0.005%), Lactobacillus acidophilus HA – 122 inactivated.
</p>

<p>
  <strong>Analytical ingredients:</strong><br>
  crude protein 25.0%, crude fat 13.0%, moisture 10.0%, crude ash 7.2%,
  crude fibre 3.2%, calcium 1.1%, phosphorus 0.5%, sodium 0.25%.
</p>

<p>
  <strong>Metabolizable energy:</strong><br>
  3,620 kcal/kg
</p>
```

## Selectors

| Field | Selector / Approach |
|---|---|
| Product title | `h1[itemprop="name"]` (first match, `.text().trim()`) |
| Ingredients description | `p.composition` — clone, remove `<strong>` child, call `.text().trim()` to strip the `"Composition:"` label |
| Analytical constituents | `findLabelledParagraph($, 'Analytical ingredients:')` — iterates all `<p>`, matches first `<strong>` child text, clones element and strips `<strong>` before returning trimmed text |
| Metabolizable energy | `findLabelledParagraph($, 'Metabolizable energy:')` — same helper as above; result appended to analytical constituents with `'\n'` separator when present |
