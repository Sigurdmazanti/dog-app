## MODIFIED Requirements

### Requirement: Scrape barfworld.com product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents from product pages on `barfworld.com` using Cheerio selectors targeting the Shopify product heading, the ingredients panel, and the guaranteed analysis panel.

The `barfworld.yaml` source file SHALL list known product URLs across the following categories: `misc` (1 product), `treats` (16 products), `barf` (10 products), and `freeze-dried` (5 products). The `productCounts` field SHALL reflect these values with a `total` of 32.

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

#### Scenario: Product lists are populated in the source YAML
- **WHEN** `barfworld.yaml` is read
- **THEN** `products.misc` SHALL contain 1 URL, `products.treats` SHALL contain 16 URLs, `products.barf` SHALL contain 10 URLs, `products.freeze-dried` SHALL contain 5 URLs, and `productCounts.total` SHALL equal 32
