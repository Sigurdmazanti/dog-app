## Context

The scraper project uses a standard `runScraper` pipeline that takes three extractor functions (title, ingredients description, composition text) and an Axios + Cheerio HTML fetch. Butternutbox.com is a React/MUI (Material UI) site with server-side rendered product content inside MUI Accordion components. The user confirmed the product data IS present in the static HTML — all accordions are rendered in the DOM (albeit in a collapsed state via `MuiCollapse-hidden`). This means Axios + Cheerio can parse the content without a headless browser.

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description, and analytical/composition text from butternutbox.com product pages
- Register the domain in `sourceRegistry.ts`
- Create the source JSON with the full catalogue of wet meals, treats, and misc products provided by the user

**Non-Goals:**
- Automated product discovery (no pagination, React-rendered listing links — user provides URLs directly)
- Handling client-side-only rendering with a headless browser
- Scraping any fields beyond title, ingredients, and analytical constituents

## Decisions

### Use `runScraper` with Cheerio (standard pipeline)

**Decision:** Use the same `runScraper` + Cheerio approach as most other scrapers (e.g., Applaws).

**Rationale:** The user confirmed the product content is present in the server-rendered HTML, including collapsed accordion sections. Cheerio can access `MuiCollapse-hidden` elements because it parses the raw DOM regardless of CSS visibility. A headless browser would be slower and unnecessary.

**Alternative considered:** Puppeteer/Playwright for full client-side rendering — rejected because it adds complexity and runtime overhead with no benefit if data is in the static HTML.

### Use data-testid and semantic selectors, not MUI class names

**Decision:** Target `[data-testid="title"]` for the product title and `[data-testid="rich-text"]` for accordion content. Use text content of the accordion button label (e.g., "Ingredients", "Nutritional info") to find the right section rather than MUI-generated class names like `mui-n8z4sp`.

**Rationale:** MUI generates hashed class suffixes (e.g., `mui-n8z4sp`) that change across builds. `data-testid` attributes and semantic button text are stable identifiers that the site explicitly exposes. This aligns with the "don't go too crazy on the selectors" guidance.

### Ingredients + Nutritional Info both fed into `extractCompositionText`

**Decision:** Return the full text of the "Ingredients" accordion from `extractIngredientsDescription`, and concatenate it with the "Nutritional info" accordion text in `extractCompositionText`. This matches the Applaws pattern.

**Rationale:** The composition AI mapper expects a combined text blob that includes both ingredient list and analytical constituents. Butternutbox separates these into two accordions; concatenating gives the mapper everything it needs.

## Risks / Trade-offs

- **MUI class hashes change on site rebuild** → Mitigated by using `data-testid` and button text matching instead.
- **Accordion content hidden at page load (MuiCollapse-hidden)** → Not a risk for Cheerio, which reads the DOM regardless of CSS state. Risk only if the site switches to true SSR exclusion (rendering content only after interaction) — monitor if scraper starts returning empty content.
- **React hydration rewrites the DOM after load** → Not relevant for Axios, which fetches the initial HTML response. If the site moves to client-only rendering, a headless browser would be needed.

## Migration Plan

1. Create `scraper/sources/butternutbox.json` with product URLs
2. Create `scraper/src/scrapers/butternutbox.ts` using `runScraper`
3. Register domain in `scraper/src/sourceRegistry.ts`
4. Create `scraper/sources/butternutbox.selectors.md`
5. Test with: `npx ts-node src/scraper.ts "<url>" --food-type wet --no-sheets`

## Open Questions

- None — the user has provided the full product URL list and representative markup.
