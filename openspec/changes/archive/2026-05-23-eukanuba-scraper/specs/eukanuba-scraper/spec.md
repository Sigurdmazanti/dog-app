## ADDED Requirements

### Requirement: Scrape Eukanuba product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `eukanuba.eu`. Product pages are server-rendered HTML; the `<ui-accordion>` accordion panels are present in the static HTML response. The title SHALL be taken from `h1 span`. The ingredients description SHALL be the text of the first `<p>` inside the `[data-accordion-content][id="Ingredients"]` div. The composition text SHALL join all `<p>` texts inside that same div, separated by `\n`, filtering out empty or whitespace-only values.

#### Scenario: Title is extracted from the product page
- **WHEN** a `eukanuba.eu` product page is scraped
- **THEN** the scraper SHALL return the text content of the `h1 span` element as the product title

#### Scenario: Ingredients accordion is present
- **WHEN** the page HTML contains a `[data-accordion-content][id="Ingredients"]` div with at least one `<p>` child
- **THEN** the result SHALL contain the text of the first `<p>` as the ingredients description

#### Scenario: Ingredients accordion is absent
- **WHEN** no `[data-accordion-content][id="Ingredients"]` div is found in the page HTML
- **THEN** the ingredients description SHALL be an empty string and the scraper SHALL NOT throw

#### Scenario: Composition text includes all paragraphs from the Ingredients accordion
- **WHEN** the `[data-accordion-content][id="Ingredients"]` div contains multiple `<p>` elements (ingredients + analytical constituents + additives)
- **THEN** the composition text SHALL be those paragraphs joined with `\n`, with empty paragraphs filtered out

### Requirement: Source registry dispatches Eukanuba URLs
The source registry SHALL route any URL containing `eukanuba.eu` to the Eukanuba scraper.

#### Scenario: Eukanuba URL is dispatched to Eukanuba scraper
- **WHEN** `findSource` is called with a URL containing `eukanuba.eu`
- **THEN** the returned entry SHALL use the `scrapeEukanuba` function and have `brand` set to `"Eukanuba"`

### Requirement: Eukanuba source JSON defines product groups and discovery config
The scraper SHALL have a source file at `scraper/sources/eukanuba.json` with `scraper: eukanuba`, `brand: Eukanuba`, `domain: eukanuba.eu`, a `discovery` block containing `productLinkSelector` set to `section.content-container [data-product-item] > a` and `listings` covering all-products, dry, and wet listing URLs, and populated `dry` and `wet` product URL lists.

#### Scenario: Source JSON is loaded without error
- **WHEN** `loadSource` is called with `eukanuba.json` and a valid food type (`dry` or `wet`)
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: Discovery listings cover all category pages
- **WHEN** `eukanuba.json` is read
- **THEN** the `discovery.listings` array SHALL contain entries for:
  - `https://www.eukanuba.eu/dog/all-dog-food` → `foodType: "dry"` (or appropriate type)
  - `https://www.eukanuba.eu/dog/dry-food` → `foodType: "dry"`
  - `https://www.eukanuba.eu/dog/wet-food` → `foodType: "wet"`

#### Scenario: Dry and wet product lists are populated
- **WHEN** `eukanuba.json` is read
- **THEN** `products.dry` and `products.wet` SHALL each be non-empty arrays of URL strings
