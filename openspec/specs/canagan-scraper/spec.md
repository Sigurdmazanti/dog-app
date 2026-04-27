## Purpose

Defines the requirements for scraping product data from `canagan.com`, including page extraction logic, source registry routing, YAML source scaffold, and selector reference documentation.

## Requirements

### Requirement: Scrape Canagan product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents text from product pages on `canagan.com` using Cheerio selectors. The product title SHALL be extracted from the second `<div>` child inside `h1.product-name`, excluding category/type label divs. Nutritional sections SHALL be extracted by locating `<h4>` headings within `div.pd-region` and taking the text of the following sibling `<p>`.

#### Scenario: Title is extracted from the second div inside h1.product-name
- **WHEN** a `canagan.com` product page is scraped and `h1.product-name` is present with multiple child divs
- **THEN** the result SHALL contain the trimmed text of the second `<div>` (index 1) inside `h1.product-name` as the product title

#### Scenario: Title excludes category label divs
- **WHEN** a `canagan.com` product page has an `h1.product-name` whose first div contains "Dry Dog Food" and whose second div contains the product variant name
- **THEN** the product title SHALL contain only the variant name, not "Dry Dog Food" or any other category label

#### Scenario: Ingredients description is extracted from the COMPOSITION section
- **WHEN** a `canagan.com` product page is scraped and a `div.pd-region` contains an `<h4>` whose trimmed text equals `"COMPOSITION"`
- **THEN** the result SHALL contain the trimmed text of the `<p>` element immediately following that `<h4>` as the ingredients description

#### Scenario: COMPOSITION section is missing
- **WHEN** a `canagan.com` product page is scraped and no `<h4>` with text `"COMPOSITION"` is found within `div.pd-region`
- **THEN** the ingredients description SHALL be an empty string

#### Scenario: Analytical constituents are extracted from the ANALYTICAL CONSTITUENTS section
- **WHEN** a `canagan.com` product page is scraped and a `div.pd-region` contains an `<h4>` whose trimmed text equals `"ANALYTICAL CONSTITUENTS"`
- **THEN** the result SHALL contain the trimmed text of the `<p>` immediately following that `<h4>` as the analytical constituents text

#### Scenario: Additives text is appended to analytical constituents
- **WHEN** a `canagan.com` product page is scraped and both `<h4>` "ANALYTICAL CONSTITUENTS" and `<h4>` "NUTRITIONAL ADDITIVES (PER KG)" are present
- **THEN** the analytical constituents text SHALL include the ANALYTICAL CONSTITUENTS paragraph followed by the NUTRITIONAL ADDITIVES paragraph, separated by a newline

#### Scenario: Additives section is absent
- **WHEN** a `canagan.com` product page is scraped and no `<h4>` with text `"NUTRITIONAL ADDITIVES (PER KG)"` is found
- **THEN** the analytical constituents text SHALL contain only the ANALYTICAL CONSTITUENTS paragraph, with no trailing newline or empty string appended

### Requirement: Canagan source YAML defines product URL scaffold
The scraper SHALL have a source file at `scraper/sources/canagan.yaml` with `scraper: canagan`, `brand: Canagan`, `domain: canagan.com`, and product URL lists for food types `dry`, `wet`, `treats`, and `toppers`. A `productCounts` map SHALL be present and SHALL match the length of each product list.

#### Scenario: Canagan YAML is loaded without error
- **WHEN** `loadSourceUrls` is called with `canagan.yaml` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: productCounts totals match list lengths
- **WHEN** `canagan.yaml` is read
- **THEN** each value in `productCounts` SHALL equal the length of the corresponding `products` list, and `productCounts.total` SHALL equal the sum of all per-category counts

### Requirement: Canagan selector reference documents HTML selectors
A file at `scraper/sources/canagan.selectors.md` SHALL document the homepage URL, a representative HTML snippet, and the selectors used to extract title, ingredients description, and analytical constituents from `canagan.com` product pages.

#### Scenario: Selector reference exists for Canagan
- **WHEN** `scraper/sources/canagan.selectors.md` is read
- **THEN** it SHALL contain the homepage URL, an HTML example, and a selectors table covering title, composition, additives, and analytical constituents extraction
