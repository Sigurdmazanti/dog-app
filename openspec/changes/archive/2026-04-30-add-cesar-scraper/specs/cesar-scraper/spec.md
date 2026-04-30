## ADDED Requirements

### Requirement: Scrape Cesar product pages
The scraper SHALL extract the product title from product pages on `cesar.com` using a Cheerio selector targeting the page's first `<h1>`. Ingredient and composition extraction SHALL return empty strings because Cesar product pages present nutrition data as images rather than HTML text.

#### Scenario: Title is extracted
- **WHEN** a `cesar.com` product page is scraped
- **THEN** the result SHALL contain the product name taken from the first `<h1>` on the page, trimmed

#### Scenario: Ingredients description is empty
- **WHEN** a `cesar.com` product page is scraped
- **THEN** the result's ingredients description SHALL be an empty string

#### Scenario: Composition text is empty
- **WHEN** a `cesar.com` product page is scraped
- **THEN** the result's composition text SHALL be an empty string

### Requirement: Source registry dispatches Cesar URLs
The source registry SHALL route any URL containing `cesar.com` to the Cesar scraper.

#### Scenario: Cesar URL is dispatched to Cesar scraper
- **WHEN** `findSource` is called with a URL containing `cesar.com`
- **THEN** the returned entry SHALL use the `scrapeCesar` function

### Requirement: Cesar source file lists known product URLs
The `scraper/sources/cesar.json` file SHALL declare brand `Cesar`, domain `cesar.com`, an empty `discovery` block, and `products` categorised by food type (`wet`, `dry`, `treats`) populated with the supplied product URLs. Non-product URLs (e.g. `recipe-finder`) SHALL NOT be included.

#### Scenario: Source file is valid
- **WHEN** the source file is loaded
- **THEN** it SHALL contain `scraper: "cesar"`, `brand: "Cesar"`, `domain: "cesar.com"`, an empty `discovery` block, and `products.wet`, `products.dry`, and `products.treats` arrays of product URLs

#### Scenario: Non-product URLs are excluded
- **WHEN** the wet product list is read
- **THEN** it SHALL NOT contain `https://www.cesar.com/recipe-finder`
