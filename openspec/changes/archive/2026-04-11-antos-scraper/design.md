## Context

The scraper supports multiple dog food brands (Animonda, Zooplus, Acana, Advance, Almo Nature, Amanova) via a shared `runScraper` helper that accepts three extraction callbacks: `extractTitle`, `extractIngredientsDescription`, and `extractCompositionText`.

Antos product pages (antos.eu) store all relevant nutritional content inside a single `div#specs` block. The ingredients description appears as inline text immediately after a `<strong>Composition</strong>` header, and the analytical constituents appear in a `<table>` within the same div. The product title is in `h1[itemprop="name"]`.

## Goals / Non-Goals

**Goals:**
- Add `scrapeAntos` using the existing `runScraper` helper
- Map `antos.eu` to the new scraper in `sourceRegistry.ts`
- Add `antos.yaml` source file and `antos.selectors.md` reference

**Non-Goals:**
- No changes to the `runScraper` helper or scraper architecture
- No handling of sub-brands or structural variants beyond the standard `div#specs` layout

## Decisions

### Decision: Use `h1[itemprop="name"]` for title extraction
The title element carries multiple presentational CSS classes that are prone to change. `itemprop=name` is a semantic attribute tied to structured data markup, making it more stable across cosmetic redesigns.

### Decision: Extract ingredients description by walking `div#specs` text nodes before the Analytical Constituents header
The `div#specs` block mixes plain text, `<strong>` headers, `<br>` separators, a `<table>`, and a trailing `<a>` element. The cleanest approach is to collect text nodes from `div#specs` contents that appear before the `Analytical Constituents` `<strong>`, discarding structural elements. This avoids fragile full-text string slicing.

### Decision: Extract analytical constituents from `div#specs table tr` rows
Each nutrient row is a `<tr>` with exactly two `<td>` children — label and value. Iterating table rows and joining them as `Label: value` pairs (separated by `; `) is consistent with the pattern used in `animonda.ts` for its ingredient list items.

## Risks / Trade-offs

- [Risk] The `div#specs` block ends with a promotional `<a>` tag — its text must not bleed into the composition output. → Mitigation: Only accumulate text from nodes before the `Analytical Constituents` header; table row extraction ignores anchor elements entirely.
- [Risk] Product variant pages (different sizes/flavours) may have a different `div#specs` structure. → Mitigation: All sampled product pages share the same layout; no special-casing needed initially. Structure can be revisited if scrape failures are observed.
