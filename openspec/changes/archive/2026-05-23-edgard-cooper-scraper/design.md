## Context

Edgard & Cooper's product pages are built with Next.js (React SSR) and use HeadlessUI `Disclosure` components to show/hide the Composition and Nutritional Info sections. The site renders product data in server-side HTML, similar to Butternutbox (MUI Accordion). Product categories span dry, wet, treats, and misc (dental).

The existing `runScraper` helper with Cheerio is sufficient — no new dependencies needed.

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description (Composition), and composition text (Nutritional Info) from `edgardcooper.com` product pages
- Register the domain in `sourceRegistry.ts`
- Provide source JSON with all product URLs across dry, wet, treats, and misc food types
- Document selectors in a `.selectors.md` reference file

**Non-Goals:**
- Paginated discovery (listings have no pagination; `productLinkSelector` is provided for batch discovery only)
- Scraping cat or puppy product pages
- Extracting price, pack sizes, or subscription data

## Decisions

### 1. Use button-text traversal for disclosure sections (same pattern as Butternutbox)

HeadlessUI Disclosure panels are rendered in the SSR HTML alongside their trigger buttons. The scraper finds `<button>` elements whose text starts with the section label and reads the text content of the adjacent panel div — the same technique used in `butternutbox.ts`.

**Alternative considered**: CSS ID-based targeting (`[id*="headlessui-disclosure-panel-"]`). Rejected because HeadlessUI generates non-deterministic IDs (`:Rb26cvff9ujpcqeijsq:`) that change across deploys.

### 2. Title from `h1.font-imperfect`

The product title is in an `<h1>` with the utility class `font-imperfect`, which is specific enough to be stable without relying on dynamic Tailwind class names like `text-[var(--product-text)]`.

**Alternative**: Plain `h1` selector. Not rejected, but `h1.font-imperfect` is more targeted.

### 3. `extractCompositionText` combines Composition + Nutritional Info

The "Composition" disclosure panel contains ingredients (used as `ingredientsDescription`). The "Nutritional Info" panel contains analytical constituents (used as `compositionText`). Both are joined with `\n` when building the composition text, mirroring the Butternutbox scraper's approach.

### 4. Source JSON uses the user-supplied product URLs

All product URLs were provided explicitly. The `discovery` block is populated with the listing URLs and the CSS selector `.container div.grid > a` for future batch discovery. The `misc` food type maps to the dental listing.

## Risks / Trade-offs

- **HeadlessUI panel visibility in SSR HTML** → If the panel is conditionally removed from the DOM when collapsed (v2 behaviour with `hidden`), text extraction will return empty strings. Mitigation: verify with `npx ts-node src/scraper.ts "<url>" --food-type dry --no-sheets` and adjust traversal if needed.
- **Tailwind utility classes change on rebuild** → Selectors based on layout classes (e.g., `border-purple-100`) could break if the site rebrands. Mitigation: `h1.font-imperfect` and button-text traversal are more semantically stable.
- **Bundle/variant pages** (e.g., `dog-bundle-tins-grain-free`) may not have composition data → Return empty strings; `runScraper` handles this gracefully.

## Migration Plan

1. Create `scraper/src/scrapers/edgard-cooper.ts`
2. Create `scraper/sources/edgard-cooper.json`
3. Register in `scraper/src/sourceRegistry.ts`
4. Create `scraper/sources/edgard-cooper.selectors.md`
5. Test one URL per food type with `--no-sheets` to validate extraction

## Open Questions

- None — all inputs (URLs, selectors, listing pages) provided by the user.
