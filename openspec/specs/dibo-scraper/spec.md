## Purpose

Define the scraping behaviour, source registry routing, and source JSON configuration for `dibodog.com` product pages.

## Requirements

### Requirement: Scrape Dibo product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `dibodog.com` using Cheerio selectors targeting the page's `h1` for the title, the `div.font-serif` block for the description, and `<details>` sections identified by their `summary h4` heading text for composition and nutritional data.

#### Scenario: Title is extracted
- **WHEN** a `dibodog.com` product page is scraped
- **THEN** the result SHALL contain the product name taken from the first `h1` element on the page, trimmed

#### Scenario: Ingredients description is extracted
- **WHEN** a `dibodog.com` product page is scraped
- **THEN** the result SHALL contain the ingredients description taken from the text content of `div.font-serif p` (the first prose paragraph below the title), trimmed

#### Scenario: Dish Composition details block is located by heading text
- **WHEN** the scraper parses a `dibodog.com` product page
- **THEN** it SHALL select the `<details>` element whose `summary h4` text equals "Dish Composition" (case-insensitive)

#### Scenario: Ingredients description falls back to composition list
- **WHEN** the `div.font-serif p` description is empty or absent
- **THEN** the `ingredientsDescription` SHALL be built from the `li` text items in the Dish Composition `<details>` block, joined by `\n`

#### Scenario: Composition text is extracted from Dish Composition list
- **WHEN** a `dibodog.com` product page is scraped
- **THEN** the result SHALL contain a composition string built by joining all `li` text items inside the Dish Composition `<details>` `ul`, separated by `\n`

#### Scenario: Nutritional Breakdown details block is located by heading text
- **WHEN** the scraper parses a `dibodog.com` product page
- **THEN** it SHALL select the `<details>` element whose `summary h4` text equals "Nutritional Breakdown" (case-insensitive)

#### Scenario: Composition text appends analytical constituents
- **WHEN** a `dibodog.com` product page is scraped
- **THEN** the composition text SHALL append `dt`/`dd` pairs from the Nutritional Breakdown `<details>` `dl`, formatted as `"<dt text>: <dd text>"` per line, separated from the ingredient list by a blank line

### Requirement: Source registry dispatches Dibo URLs
The source registry SHALL route any URL containing `dibodog.com` to the Dibo scraper.

#### Scenario: Dibo URL is dispatched to Dibo scraper
- **WHEN** `findSource` is called with a URL containing `dibodog.com`
- **THEN** the returned entry SHALL use the `scrapeDibo` function

### Requirement: Dibo source JSON lists BARF products
The `dibo.json` source file SHALL contain the brand name `"Dibo"`, domain `"dibodog.com"`, and a `barf` product category with all 50 known product URLs.

#### Scenario: Source file is valid
- **WHEN** `dibo.json` is loaded by the batch scraper
- **THEN** it SHALL parse without errors and the `products.barf` array SHALL contain 50 entries
