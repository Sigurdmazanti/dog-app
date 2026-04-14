## ADDED Requirements

### Requirement: Scrape barfworld.com product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents from product pages on `barfworld.com` using Cheerio selectors targeting the Shopify product heading, the ingredients panel, and the guaranteed analysis panel.

#### Scenario: Title is extracted from the product heading
- **WHEN** a `barfworld.com` product page is scraped
- **THEN** the result SHALL contain the trimmed text of `h1.product-title.title` as the title

#### Scenario: Ingredients description is extracted from the ingredients panel
- **WHEN** a `barfworld.com` product page is scraped and the page contains `#panel-ingredients`
- **THEN** the result SHALL contain the trimmed text of the first `p` inside `#panel-ingredients .metafield-rich_text_field` as the ingredients description

#### Scenario: Analytical constituents are extracted from the guaranteed analysis panel
- **WHEN** a `barfworld.com` product page is scraped and the page contains `#panel-guaranteed-analysis`
- **THEN** the result SHALL contain a `"; "`-separated string built from the trimmed text of every `li` inside `#panel-guaranteed-analysis .metafield-rich_text_field` as the analytical constituents

#### Scenario: Composition text combines ingredients and analytical constituents
- **WHEN** both ingredients description and analytical constituents are present
- **THEN** the result SHALL contain both joined with a newline, ingredients description first

#### Scenario: Composition text omits absent sections
- **WHEN** either ingredients description or analytical constituents is empty or absent
- **THEN** the result SHALL contain only the non-empty section, with no leading or trailing newline
