## Context

The scraper package already has a pattern for site-specific scrapers: a TypeScript function using `runScraper` + Cheerio, a source YAML, a selectors reference, and a source registry entry. This change follows that exact pattern for `bosch-tiernahrung.de`.

The Bosch product page structure uses a tab-panel layout where tabs are `<a>` elements inside `ul.tabs-label-list` with `aria-controls` attributes pointing to `div.tabs-content` panels by ID. This is similar to the Blue Buffalo tab pattern and allows the same lookup approach: find the tab by text, read `aria-controls`, then select by `[id="<value>"]`.

Product URLs will be supplied separately and are not part of this change — the source YAML is created with empty product lists as a scaffold.

## Goals / Non-Goals

**Goals:**
- Extract product title, composition (ingredients), and analytical constituents from `bosch-tiernahrung.de` product pages
- Register the scraper in `sourceRegistry.ts`
- Create a scaffold source YAML and selector reference

**Non-Goals:**
- Populating product URLs in the source YAML (supplied separately)
- Scraping brand listing or category pages to discover URLs
- Handling non-dog-food product pages on the same domain

## Decisions

### 1. Title composed from brand link + h1

**Decision:** Compose the title from the text of `div.product-brand-name a` (sub-brand, e.g. "bosch HPC Soft / Plus") and `h1.typo-h1` (variant, e.g. "Junior Chicken & Sweet Potato"), joined with a space. Fall back to `h1` alone if the brand element is absent.

**Rationale:** Mirrors the Blue Buffalo pattern (sub-brand + variant). The brand div link text gives the product line, the h1 gives the variant name. Neither alone is a complete product title.

**Alternatives considered:**
- h1 only — loses sub-brand context; products with the same variant name across lines would be indistinguishable.
- `<title>` tag — often includes site name suffix; requires stripping.

### 2. Tab lookup via `aria-controls` on `ul.tabs-label-list a`

**Decision:** Find a tab `<a>` by matching its trimmed text content, read its `aria-controls` attribute, then select the panel via `[id="<value>"]`.

**Rationale:** ID-based lookup is robust against positional changes (if Bosch reorders tabs, positional index breaks; `aria-controls` does not). The same strategy is already proven in `bluebuffalo.ts`.

**Alternatives considered:**
- Positional index (`div.tabs-content:nth-child(2)`) — brittle if tab order changes.
- Hardcoding panel IDs (`#tabpanel2`, `#tabpanel4`) — works today but ties the scraper to the current DOM IDs.

### 3. Composition and analytical constituents extracted as trimmed plain text

**Decision:** Read the full `.text().trim()` of the located tabpanel for both the Composition and Analytical components tabs. For Analytical components, append the Supplements tab content (if present) separated by a newline.

**Rationale:** Bosch panels contain plain text for composition and a structured-but-short paragraph for analyticals. Unlike Blue Buffalo, there are no anchor tags or `data-tag-text` attributes to parse. Plain text extraction is both accurate and simpler. Including supplements in the composition text preserves the full nutritional picture (vitamins, trace elements, additives) for downstream composition mapping.

**Alternatives considered:**
- Separate field for supplements — the `ScrapeResult` interface has no such field; appending to `extractCompositionText` avoids interface changes.
- Parsing analytical values into key/value pairs — unnecessary; the downstream composition mapper processes raw text.

### 4. Source YAML scaffolded with empty lists

**Decision:** Create `bosch.yaml` with `scraper: bosch`, `domain: bosch-tiernahrung.de`, empty product lists for `dry`, `wet`, `treats`, `misc`, and `productCounts` all set to `0`.

**Rationale:** The YAML must exist for the CLI to load it, but URLs are out of scope. An empty scaffold avoids breaking CLI invocations while making it clear the file is not yet populated.

## Risks / Trade-offs

- **Tab text is in the page language** — The sample markup shows English tab labels ("Composition", "Analytical components"). If the same URL serves German labels on different locales, tab lookup by text will fail silently (return empty string).
  → Mitigated by documenting the expected labels in the selectors reference. Can be addressed per-run if needed.

- **`h1` visibility class (`hidden lg:block`)** — The `h1` is hidden on small screens but present in DOM. Cheerio parses the DOM, not the rendered layout, so the selector works regardless.
  → No mitigation needed.
