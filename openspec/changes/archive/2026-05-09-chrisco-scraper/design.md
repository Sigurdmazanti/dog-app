## Context

`chrisco.dk` is a Magento-based Danish pet shop. Product pages use the Amasty Tabs extension which renders content panels as `div[data-role="content"]` elements controlled by tab links (`a.data.switch`). Each tab link's `href` attribute points to the associated panel ID (e.g., `href="#amcustomtabs_tabs_12"`).

The nutritional content tab ("Næringsindhold") contains both the ingredients list (under `Sammensætning:`) and the analytical constituents (under `Analytiske bestanddele:`) as a single block of text. This is the primary source for AI composition mapping.

## Goals / Non-Goals

**Goals:**
- Extract product title from `h1.page-title`
- Locate the "Næringsindhold" tab panel by tab link text (not by hardcoded panel ID) and extract its full text content as both `ingredientsDescription` and `compositionText`
- Register `chrisco.dk` in the source registry
- Populate source JSON with product URLs for `dry`, `wet`, and `treats`

**Non-Goals:**
- Parsing or splitting the Danish text (handled downstream by AI mapper)
- Scraping discovery / listing pages

## Decisions

### Tab panel lookup by label, not hardcoded ID

The Amasty Tabs implementation assigns IDs like `amcustomtabs_tabs_12` which may vary across Magento installations. Following the same pattern as the Bosch scraper (which uses `aria-controls` on `[role=tab]` elements), the Chrisco scraper SHALL locate the target panel by finding the `a.data.switch` element whose text content matches the desired label, then reading its `href` attribute (stripping the `#` prefix) to get the panel ID.

**Alternative considered:** Hardcode `#amcustomtabs_tabs_12`. Rejected — brittle if the Magento instance is reconfigured.

### Single panel for both extractIngredientsDescription and extractCompositionText

The nutritional tab panel contains the full composition block as a contiguous string. Both `extractIngredientsDescription` and `extractCompositionText` return the same panel text, which the AI mapper then parses into structured sections. This is consistent with other Danish-language scrapers in the codebase.

## Risks / Trade-offs

- **Danish locale text** → The AI composition mapper handles translation/normalisation; no extra localisation work needed in the scraper itself.
- **Tab panel may be hidden (style=display:none)** → Cheerio operates on raw HTML and does not execute CSS/JS visibility; the panel text is always accessible regardless of display state.
- **Magento tab IDs change after a site upgrade** → Mitigated by label-based lookup; if the label text changes, the extractor returns an empty string and the run log will surface it.
