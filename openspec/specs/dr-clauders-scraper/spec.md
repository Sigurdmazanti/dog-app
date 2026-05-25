## Purpose

Defines the requirements for scraping product data from `dr-clauder.com`, including page extraction logic, source registry routing, JSON source scaffold, and selector reference documentation.

## Requirements

### Requirement: Scrape Dr. Clauder's product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents text from product pages on `dr-clauder.com` using Cheerio selectors targeting `h1.product-detail__title` for the title and `#composition-content` for the composition block.

#### Scenario: Title is extracted from the product detail heading
- **WHEN** a `dr-clauder.com` product page is scraped and `h1.product-detail__title` is present
- **THEN** the result SHALL contain the trimmed text of `h1.product-detail__title` as the title

#### Scenario: Ingredients description is extracted from the composition tab
- **WHEN** a `dr-clauder.com` product page is scraped
- **THEN** the result SHALL contain the trimmed text content of `#composition-content` as the ingredients description

#### Scenario: Composition text passed to AI mapper is the full composition tab content
- **WHEN** a `dr-clauder.com` product page is scraped
- **THEN** the composition text passed to the AI mapper SHALL be the trimmed text content of `#composition-content`, containing the ingredients list, analytical constituents, and additives in a single block

### Requirement: Source registry dispatches Dr. Clauder's URLs
The source registry SHALL route any URL containing `dr-clauder.com` to the Dr. Clauder's scraper.

#### Scenario: Dr. Clauder's URL is dispatched to the Dr. Clauder's scraper
- **WHEN** `findSource` is called with a URL containing `dr-clauder.com`
- **THEN** the returned entry SHALL use the `scrapeDrClauders` function

### Requirement: Dr. Clauder's source JSON defines product scaffold and discovery config
The scraper SHALL have a source file at `scraper/sources/dr-clauders.json` with `scraper: dr-clauders`, `brand: Dr. Clauder's`, `domain: dr-clauder.com`, discovery config for per-food-type listings, and empty product lists for food types `dry`, `wet`, `treats`, and `misc`.

#### Scenario: Source JSON loads without error for each food type
- **WHEN** `loadSource` is called with `dr-clauders.json` and a valid food type (`dry`, `wet`, `treats`, or `misc`)
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: Discovery listings cover all four food type categories
- **WHEN** the `discovery.listings` array in `dr-clauders.json` is read
- **THEN** it SHALL contain at least one entry for each of `dry`, `wet`, `treats`, and `misc` food types

#### Scenario: Discovery config includes productLinkSelector and pagination
- **WHEN** the `discovery` block in `dr-clauders.json` is read
- **THEN** it SHALL contain `productLinkSelector: ".product-block > .product-block__image-container a.product-block__image"` and a `pagination` block with `nextSelector: ".pagination > .next > a"` and `maxPages: 8`

### Requirement: Dr. Clauder's selector reference documents HTML selectors
A file at `scraper/sources/dr-clauders.selectors.md` SHALL document the homepage URL, a representative HTML snippet, and the selectors used to extract title and composition from `dr-clauder.com` product pages.

#### Scenario: Selector reference exists for Dr. Clauder's
- **WHEN** `scraper/sources/dr-clauders.selectors.md` is read
- **THEN** it SHALL contain the homepage URL, an HTML example, and a selectors table covering title and composition content extraction
