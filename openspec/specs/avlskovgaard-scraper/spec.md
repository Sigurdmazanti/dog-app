## Purpose

Define the scraping behaviour for product pages on `avlskovgaard.dk`.

## Requirements

### Requirement: Scrape Avlskovgaard product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents from product pages on `avlskovgaard.dk` using Cheerio selectors targeting the Shopify product title, the ingredients paragraph following the INGREDIENSER heading, and the `table.nutrition-table` rows within the `.accordion__content.rte` block.

#### Scenario: Title is extracted from the Shopify product heading
- **WHEN** an `avlskovgaard.dk` product page is scraped
- **THEN** the result SHALL contain the trimmed text of `div.product__title h1` as the title

#### Scenario: Ingredients description is extracted from the accordion content
- **WHEN** an `avlskovgaard.dk` product page is scraped and `.accordion__content.rte` contains an `<h3>` whose text includes "INGREDIENSER"
- **THEN** the result SHALL contain the trimmed text of the `<p>` element immediately following that heading as the ingredients description

#### Scenario: Analytical constituents are extracted from the nutrition table rows
- **WHEN** an `avlskovgaard.dk` product page is scraped
- **THEN** the result SHALL contain a `; `-separated string of `Label: value` pairs built from every `table.nutrition-table tr` body row, where the label is the first `<td>` (trimmed) and the value is the second `<td>` (trimmed)

#### Scenario: Composition text combines ingredients and analytical constituents
- **WHEN** both ingredients description and analytical constituents are present
- **THEN** the result SHALL contain both joined with a newline, ingredients description first
