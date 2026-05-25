## Context

Eukanuba is a premium dog food brand. Their EU website (`eukanuba.eu`) serves product pages as server-rendered HTML. Each product page contains an accordion-style layout; the ingredients, analytical constituents, and additives are all rendered inside `<ui-accordion>` elements with `data-accordion-content` divs. The page structure is static HTML — no SPA framework or client-side data loading, so standard Cheerio scraping is sufficient.

Product listings use Alpine.js for a "load more" pagination pattern (`@click=showMore()`, `x-show` on the load-more button). Because Axios fetches static HTML only, the scraper cannot click the load-more button; all product URLs are therefore pre-populated in the source JSON rather than discovered dynamically at runtime.

## Goals / Non-Goals

**Goals:**
- Extract product title, ingredients description, and full composition text from Eukanuba product pages using `runScraper` + Cheerio
- Register `eukanuba.eu` in the source registry
- Provide source JSON with pre-populated `dry` and `wet` product URL lists
- Include discovery config for future automated discovery if Alpine.js rendering is ever bypassed

**Non-Goals:**
- Dynamic load-more pagination traversal (site requires JS execution; out of scope)
- Scraping product variant information (size/pack options)
- Any React Native / app-side changes

## Decisions

### Decision: Use `runScraper` + Cheerio (standard pipeline)
The Eukanuba product page HTML is fully server-rendered — the `<ui-accordion>` content divs are present in the static HTML response even though they render as collapsed accordions visually. Cheerio can select their content directly without JavaScript execution.

**Alternative considered:** Playwright-based browser scraping to handle Alpine.js. Rejected — unnecessary overhead for product pages where static HTML is sufficient.

### Decision: Extract title from `h1`
The product name is in an `<h1>` element containing a `<span>` child. The selector `h1 span` (or simply reading `h1` text) gives the clean product title.

**Example markup:**
```html
<h1 class="text-text font-black ..."><span>Special Care Sensitive Skin Adult All Breed</span></h1>
```

### Decision: Extract ingredients from the Ingredients accordion
The ingredients text is in the `data-accordion-content` div inside the `<ui-accordion>` whose header button has `id="Ingredients"`. The `<p>` tags inside that div contain the composition data (ingredients list, analytical constituents, additives).

**Extraction strategy:**
- `extractIngredientsDescription`: select the first `<p>` inside the `#Ingredients` accordion content div — this is the raw ingredients list
- `extractCompositionText`: join all `<p>` text nodes from the `#Ingredients` accordion content, separated by `\n`, to capture ingredients + analytical constituents + additives in one block

**Alternative considered:** Selecting paragraphs by index. Rejected in favour of full-text join to avoid missing additives/vitamins sections regardless of paragraph count.

### Decision: Source JSON uses pre-populated product lists, not runtime discovery
The listings pages use Alpine.js `showMore()` for pagination. Axios fetches can only see the initial page load (first batch of products). All known product URLs have been provided by the user and are pre-populated in `products.dry` and `products.wet`.

The `discovery` block is included with `listings` and `productLinkSelector` for completeness and future use, but runtime discovery will only yield the first page of results.

## Risks / Trade-offs

- **[Risk] Alpine.js hides paginated products** → Mitigation: pre-populate all known URLs in source JSON; re-run discovery manually if new products are added to the site
- **[Risk] Accordion content structure changes** → Mitigation: selector reference documents current markup; failures will surface as empty ingredients on test runs
- **[Risk] `#Ingredients` ID is localised on non-EU subdomains** → Mitigation: this scraper targets `eukanuba.eu` only; other regional subdomains are out of scope
