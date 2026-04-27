## ADDED Requirements

### Requirement: Scrape Bozita product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents text from product pages on `bozita.com` using Cheerio selectors targeting `h1.headline` and `h5` sibling traversal within `div.product-detail`.

#### Scenario: Title is extracted from h1.headline
- **WHEN** a `bozita.com` product page is scraped and `h1.headline` is present
- **THEN** the result SHALL contain the trimmed text content of `h1.headline` as the product title

#### Scenario: Ingredients description is extracted from the COMPOSITION section
- **WHEN** a `bozita.com` product page is scraped and a `div.product-detail` contains an `h5` whose trimmed text equals `"COMPOSITION"`
- **THEN** the result SHALL contain the trimmed text of the `p` element immediately following that `h5` as the ingredients description

#### Scenario: COMPOSITION section is missing
- **WHEN** a `bozita.com` product page is scraped and no `h5` with text `"COMPOSITION"` is found
- **THEN** the ingredients description SHALL be an empty string

#### Scenario: Analytical constituents are extracted from the ANALYTICAL CONSTITUENTS section
- **WHEN** a `bozita.com` product page is scraped and a `div.product-detail` contains an `h5` whose trimmed text equals `"ANALYTICAL CONSTITUENTS"`
- **THEN** the result SHALL contain the trimmed text of the `p` element immediately following that `h5` as the analytical constituents text

#### Scenario: Additives text is appended to analytical constituents
- **WHEN** a `bozita.com` product page is scraped and both `h5` "ANALYTICAL CONSTITUENTS" and `h5` "ADDITIVES (PER KG)" are present
- **THEN** the analytical constituents text SHALL include the ANALYTICAL CONSTITUENTS paragraph followed by the ADDITIVES (PER KG) paragraph, separated by a newline

#### Scenario: Additives section is absent
- **WHEN** a `bozita.com` product page is scraped and no `h5` with text `"ADDITIVES (PER KG)"` is found
- **THEN** the analytical constituents text SHALL contain only the ANALYTICAL CONSTITUENTS paragraph, with no trailing newline or empty string appended

### Requirement: Source registry dispatches Bozita URLs
The source registry SHALL route any URL containing `bozita.com` to the Bozita scraper.

#### Scenario: Bozita URL is dispatched to Bozita scraper
- **WHEN** `findSource` is called with a URL containing `bozita.com`
- **THEN** the returned entry SHALL use the `scrapeBozita` function and have `brand` set to `"Bozita"`

### Requirement: Bozita source YAML defines product URL scaffold
The scraper SHALL have a source file at `scraper/sources/bozita.yaml` with `scraper: bozita`, `domain: bozita.com`, and product lists for food types `dry`, `wet`, and `treats`. A `productCounts` map SHALL be present and SHALL match the length of each product list.

#### Scenario: Bozita YAML is loaded without error
- **WHEN** `loadSourceUrls` is called with `bozita.yaml` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: productCounts totals match list lengths
- **WHEN** `bozita.yaml` is read
- **THEN** each value in `productCounts` SHALL equal the length of the corresponding `products` list, and `productCounts.total` SHALL equal the sum of all per-category counts

### Requirement: Bozita selector reference documents HTML selectors
A file at `scraper/sources/bozita.selectors.md` SHALL document the homepage URL, a representative HTML snippet, and the selectors used to extract title, ingredients description, and analytical constituents from `bozita.com` product pages.

#### Scenario: Selector reference exists for Bozita
- **WHEN** `scraper/sources/bozita.selectors.md` is read
- **THEN** it SHALL contain the homepage URL, an HTML example, and a selectors table covering title, composition, additives, and analytical constituents extraction
