## Context

Dibo (dibodog.com) product pages use a Shopify-like HTML structure. Products are rendered with a prominent `h1` heading, followed by a description block, and expandable `<details>` sections for composition and nutritional data. The scraper project already has a `runScraper` helper and Cheerio-based pattern established by existing scrapers (e.g. `cavom.ts`, `barfworld.ts`).

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description, and composition text from dibodog.com pages using Cheerio selectors
- Register `dibodog.com` in `sourceRegistry.ts`
- Add `dibo.json` with 50 BARF product URLs under a `barf` category

**Non-Goals:**
- Automated product discovery (listings / `productLinkSelector` left empty for now)
- Wet or dry food categories (all current products are BARF)
- Any changes to shared scraper infrastructure

## Decisions

### Title selector: `h1` inside the product hero block
- **Decision**: Use `$('h1').first()` — the product title is the only `h1` on the page
- **Alternative**: Scope to `.bg-tertiary h1` for tighter targeting, but `h1` alone is unambiguous given Shopify page structure

### Ingredients description: prose paragraph below the `h1`
- **Decision**: Select the first `div.font-serif p` or the `div.font-serif` block directly after the `h1`, trimmed as a string
- The description block uses class `font-serif` and contains a `<p>` tag with the intro text

### Composition (ingredient list): `<details>` matched by summary heading text
- **Decision**: Iterate `<details>` elements; match the one whose `summary h4` text equals "Dish Composition" (case-insensitive); collect `li` text items from the `ul` inside, joining with `\n`
- **Alternative**: Use a CSS nth-child selector — rejected because heading order is not guaranteed across products

### Analytical data: `<details>` matched by "Nutritional Breakdown" heading
- **Decision**: Locate the `<details>` whose `summary h4` equals "Nutritional Breakdown"; concatenate `dt` + `dd` pairs as `"<dt>: <dd>"` lines, joined by `\n`
- This forms the `compositionText` returned to the shared pipeline for NFE calculation

### `extractCompositionText` combines list + analytics
- **Decision**: Return the ingredient list items as `ingredientsDescription` and the `dt/dd` analytical pairs as `compositionText`, consistent with how other scrapers separate the two fields

## Risks / Trade-offs

- [Shopify HTML may vary per theme update] → Selectors are readable class names (`font-serif`, `bg-tertiary`) which are relatively stable theme tokens; monitor on future scrape runs
- [50 BARF URLs provided up front] → No automated discovery needed now; `discovery` block left empty and can be populated later
