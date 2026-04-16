## 1. Scraper Implementation

- [x] 1.1 Create `scraper/src/scrapers/bosch.ts` with `scrapeBosch` function using `runScraper`
- [x] 1.2 Implement `extractTitle`: compose brand link text (`div.product-brand-name a`) + `h1.typo-h1`, fall back to `h1` alone when brand is absent
- [x] 1.3 Implement `extractIngredientsDescription`: find the `"Composition"` tab link in `ul.tabs-label-list`, read `aria-controls`, extract trimmed text of the matching tabpanel
- [x] 1.4 Implement `extractCompositionText`: find the `"Analytical components"` tab link, extract tabpanel text; append Supplements tabpanel text (separated by newline) if the `"Supplements"` tab link is present
- [x] 1.5 Verify scraper compiles without TypeScript errors (`yarn tsc --noEmit` in `scraper/`)

## 2. Source Registry

- [x] 2.1 Add a Bosch entry to `scraper/src/sourceRegistry.ts` routing URLs containing `bosch-tiernahrung.de` to `scrapeBosch`
- [x] 2.2 Verify `findSource` returns the Bosch entry for a `bosch-tiernahrung.de` URL

## 3. Source YAML

- [x] 3.1 Create `scraper/sources/bosch.yaml` with `scraper: bosch`, `domain: bosch-tiernahrung.de`, empty lists for `dry`, `wet`, `treats`, `misc`, and `productCounts` all set to `0` (total: 0)

## 4. Selector Reference

- [x] 4.1 Create `scraper/sources/bosch.selectors.md` with homepage URL, representative HTML snippet (from the provided markup), and a selectors table covering brand title, h1 variant name, composed title, Composition tabpanel, analytical components tabpanel, and Supplements tabpanel
