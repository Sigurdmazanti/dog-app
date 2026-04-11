## Context

The scraper supports multiple dog food brands via a shared `runScraper` helper that accepts three extraction callbacks: `extractTitle`, `extractIngredientsDescription`, and `extractCompositionText`.

Applaws product pages (`applaws.com`) present two separate title-contributing elements:
- `p.f-h5--filson`: contains the sub-brand/product line together with the brand name and pack size (e.g. `Applaws™ Taste Toppers Natural Wet Dog Food • 16 x 156g`)
- `h1.c-detail__title`: contains the variant name (e.g. `Variety Selection in Broth`)

The composed product title strips the brand name prefix (`Applaws` + trademark), the bullet separator, and the pack-size quantity, then appends the `h1` variant title to form a clean name like `Taste Toppers Natural Wet Dog Food Variety Selection in Broth`.

Composition data lives in an `<article>` accordion panel whose trigger button contains the text `Composition`. The analytical constituents are in a sibling accordion panel labelled `Nutrition`.

## Goals / Non-Goals

**Goals:**
- Add `scrapeApplaws` using the existing `runScraper` helper
- Compose the product title from `.f-h5--filson` + `h1.c-detail__title`, stripping trademark symbols and pack-size quantities
- Map `applaws.com` to the new scraper in `sourceRegistry.ts`
- Add `applaws.yaml` source file and `applaws.selectors.md` reference

**Non-Goals:**
- No changes to the `runScraper` helper or scraper architecture
- No handling of multi-language regional variants (UK-only initially)
- No scraping of images, pricing, or availability

## Decisions

### Decision: Compose title from `.f-h5--filson` prefix + `h1.c-detail__title` suffix

The `h1` alone yields only the variant/flavour name (e.g. `Variety Selection in Broth`), which is not unique across the product range. The `.f-h5--filson` element holds the sub-brand/product-line context. Combining both gives a complete, human-readable title consistent with what is shown on the page.

**Alternative considered:** Use only the `h1` title — rejected because variant names are not unique across ranges.

### Decision: Strip trademark symbol (™) and pack-size quantity from `.f-h5--filson` text

The trademark symbol carries no nutritional or identification value and would produce inconsistent output across sources. The pack-size string (e.g. `• 16 x 156g`) is a format/quantity detail irrelevant to the product identity; it would pollute the product name.

**Approach:** Apply a regex replace to remove `™` and a second replace to strip the bullet+quantity pattern `\s*•\s*\d+\s*x\s*[\d.]+g` (case-insensitive, trimmed).

### Decision: Extract composition from the accordion panel identified by button text `Composition`

The accordion uses Alpine.js with no stable `id` attributes on the content panels. The most reliable selector is to find the `<article>` whose `<button>` contains the text `Composition` and then read the `.f-body` div inside it.

### Decision: Extract analytical constituents from the `Nutrition` accordion panel

The nutrition content (e.g. `818 kcal/kg`) appears inside the `Nutrition` accordion panel following the same structure as the Composition panel.

## Risks / Trade-offs

- [Risk] Pack-size patterns may vary (e.g. `6 x 400g`, `1 x 2kg`) — the regex `\s*•\s*\d+\s*x\s*[\d.]+\s*(kg|g)` covers the observed pattern but may miss edge cases. → Mitigation: Regex can be extended when new patterns are encountered; the selectors.md will document observed examples.
- [Risk] The `.f-h5--filson` element may be absent on some product variants. → Mitigation: Fall back to the `h1` title alone if the element is not found.
- [Risk] Accordion panel order may differ across product types (dry vs wet). → Mitigation: Match panels by button text rather than index, so order is irrelevant.
