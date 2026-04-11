## Purpose

Define the scraping behaviour for Arion product pages on `arion-petfood.dk`.

## Requirements

### Requirement: Scrape Arion product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents from product pages on `arion-petfood.dk` using Cheerio selectors targeting the WooCommerce product title, `.nutrition-tab__table__row` spans, and the `#tab-description` ingredients list.

#### Scenario: Title is extracted from the WooCommerce product heading
- **WHEN** an `arion-petfood.dk` product page is scraped
- **THEN** the result SHALL contain the trimmed text of `h1.entry-title.product_title` as the title

#### Scenario: Ingredients description is extracted from the tab description panel
- **WHEN** an `arion-petfood.dk` product page is scraped and `#tab-description` contains a `<b>` element whose text is `Ingredienser:`
- **THEN** the result SHALL contain a comma-separated string of the `<li>` text items from the `<ul>` that follows that paragraph, trimmed

#### Scenario: Analytical constituents are extracted from all nutrition table rows
- **WHEN** an `arion-petfood.dk` product page is scraped
- **THEN** the result SHALL contain a `; `-separated string of `Label: value` pairs built from every `.nutrition-tab__table .nutrition-tab__table__row` element, where label is the first `<span>` (trimmed) and value is the second `<span>` (trimmed)

#### Scenario: Extra rows inside `.extra-rows` are included in analytical constituents
- **WHEN** an `arion-petfood.dk` product page contains extended nutrient rows inside `.extra-rows` child divs
- **THEN** those rows SHALL be included in the analytical constituents output alongside the primary rows

#### Scenario: Composition text combines ingredients and analytical constituents
- **WHEN** both ingredients description and analytical constituents are present
- **THEN** the result SHALL contain both joined with a newline, ingredients first
