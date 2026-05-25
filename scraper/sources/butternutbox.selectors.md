# Butternutbox — Selector Reference

**Homepage:** https://butternutbox.com/  
**Scraper:** `butternutbox.ts`  
**Domain:** `butternutbox.com`

## HTML Example

```html
<!-- Product title -->
<h2 data-testid="title" class="MuiTypography-root MuiTypography-h2 ...">Beef It Up</h2>

<!-- Ingredients accordion -->
<div class="MuiAccordion-root MuiAccordion-gutters ...">
  <h3 class="MuiAccordion-heading ...">
    <button class="MuiAccordionSummary-root ...">
      <span class="MuiAccordionSummary-content ...">
        <p class="MuiTypography-root MuiTypography-h6 ...">Ingredients</p>
      </span>
    </button>
  </h3>
  <div class="MuiCollapse-root MuiCollapse-hidden ...">
    <div class="MuiAccordionDetails-root ...">
      <div data-testid="rich-text">
        <p>What's in it and Why?</p>
        <ul>
          <li><p>Beef: A hearty, complete protein...</li>
          ...
        </ul>
        <p>Human-Quality Beef 60% (Beef, Ox Heart, Ox Liver), Carrots (13%), ...</p>
      </div>
    </div>
  </div>
</div>

<!-- Nutritional info accordion -->
<div class="MuiAccordion-root MuiAccordion-gutters ...">
  <h3 class="MuiAccordion-heading ...">
    <button class="MuiAccordionSummary-root ...">
      <span class="MuiAccordionSummary-content ...">
        <p class="MuiTypography-root MuiTypography-h6 ...">Nutritional info</p>
      </span>
    </button>
  </h3>
  <div class="MuiCollapse-root MuiCollapse-hidden ...">
    <div class="MuiAccordionDetails-root ...">
      <div data-testid="rich-text">
        <p>Analytical constituents:</p>
        <p>Crude protein 12.0%, Crude fat 10.0%, Crude fibres 0.7%, Crude ash 1.7%, Moisture content 70.0%</p>
        <p>Nutritional additives:</p>
        <p>Additives per kg: Vitamin D3 250IU, ...</p>
      </div>
    </div>
  </div>
</div>
```

## Selectors

| Field | Selector / Approach | Notes |
|---|---|---|
| Product title | `[data-testid="title"]` | Stable `data-testid` attribute; avoids fragile MUI hash class names |
| Accordion label | `button p` (first `<p>` inside button) | Text is `"Ingredients"` or `"Nutritional info"` — matched by text content |
| Accordion container | `$(btn).closest('[class*="MuiAccordion-root"]')` | Traverses up from button to the accordion root |
| Ingredients text | `[data-testid="rich-text"]` inside the "Ingredients" accordion | Includes "What's in it and Why?" narrative + ingredient list |
| Nutritional info text | `[data-testid="rich-text"]` inside the "Nutritional info" accordion | Contains analytical constituents + nutritional additives |

## Extraction Logic

1. **Title**: Select `[data-testid="title"]` and return its trimmed text.
2. **Ingredients**: Iterate all `button` elements; find the one whose first `<p>` child has text `"Ingredients"`; traverse up to the `MuiAccordion-root` ancestor; extract the full text of `[data-testid="rich-text"]` within it.
3. **Composition text**: Same approach as step 2 but match `"Nutritional info"`. Concatenate ingredients description (step 2) + nutritional info text, joined with `\n`.

## Notes

- The site is React/MUI (Material UI). MUI generates hashed class suffixes (e.g., `mui-n8z4sp`) that change with each build — **do not use** these in selectors.
- Accordion panels use `MuiCollapse-hidden` when collapsed. Cheerio reads the full DOM regardless of CSS state, so the content is accessible without a headless browser.
- The `data-testid` attributes (`title`, `rich-text`) are stable identifiers explicitly set by the site's developers.
- The "Ingredients" `[data-testid="rich-text"]` section contains both the descriptive narrative ("What's in it and Why?") and the formal ingredient list — both are returned together and fed to the AI composition mapper.
- The "Storage and use" accordion is ignored; it contains no nutritional data.
- URL pattern: `/our-dog-food/<category>/<slug>` — category is `fresh-meals`, `treats-and-chews`, or `supplements`.
