## Context

The scraper supports multiple dog food brands via a shared `runScraper` helper that accepts three extraction callbacks: `extractTitle`, `extractIngredientsDescription`, and `extractCompositionText`.

Carnilove product pages (carnilove.com) use an Astro-based site with `tray-component` custom elements for expandable content sections. The product title is in `h1 .heading__text`. Ingredients are inside a tray with `data-tray-id="tray-ingredients"`, within a `div[data-astro-cid-rzyzl636] span` element. Nutrition/analytical constituents are inside a tray with `data-tray-id="tray-nutrition"`, spread across multiple `p span` elements within `div[data-astro-cid-rzyzl636]`.

## Goals / Non-Goals

**Goals:**
- Add `scrapeCarnilove` using the existing `runScraper` helper
- Map `carnilove.com` to the new scraper in `sourceRegistry.ts`
- Add `carnilove.yaml` source file and `carnilove.selectors.md` reference

**Non-Goals:**
- No changes to the `runScraper` helper or scraper architecture
- No handling of non-English product page variants

## Decisions

### Decision: Use `h1 .heading__text` for title extraction
The product title sits inside `h1 > span.heading__text`. The `data-astro-cid-*` attributes are build-generated hashes that change across deployments, so selectors must avoid them. The `.heading__text` class inside `h1` is a semantic, stable selector.

### Decision: Use `tray-component[data-tray-id="tray-ingredients"]` for ingredients extraction
The `data-tray-id` attribute is a stable, semantic identifier used by the site's tray component system. The ingredients text lives in a `span` element inside `div[data-astro-cid-rzyzl636]` within this tray. Since `data-astro-cid-rzyzl636` is a build hash that may change, the extractor should target the tray by `data-tray-id` and then find the first meaningful text content within the `.tray__content` area.

### Decision: Use `tray-component[data-tray-id="tray-nutrition"]` for composition text extraction
The nutrition tray contains multiple `p` elements with `span` children holding crude protein, additives, and energy values. The extractor collects all paragraph text from the `.tray__content` area within this tray and joins them, combined with the ingredients description, to form the full composition text for AI mapping.

### Decision: Navigate tray content via `.tray__content` descendant selector
Rather than relying on `data-astro-cid-*` attributes (which are Astro build hashes and unstable), selectors chain from the stable `data-tray-id` attribute down through `.tray__content` to reach the text content. This is resilient to Astro rebuilds.

## Risks / Trade-offs

- [Risk] The `data-astro-cid-*` attributes are generated per-build and will change. → Mitigation: All selectors avoid these attributes, using only `data-tray-id`, `.heading__text`, and `.tray__content` which are semantic and stable.
- [Risk] Some product pages may have additional tray sections or differently structured nutrition content. → Mitigation: The `data-tray-id` attribute explicitly identifies each section; only "tray-ingredients" and "tray-nutrition" are targeted. Structure can be revisited if scrape failures are observed.
