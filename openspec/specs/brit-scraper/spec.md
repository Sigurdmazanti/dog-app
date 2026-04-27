## Purpose

Defines the requirements for scraping product data from `brit-petfood.com`, including page extraction logic, source registry routing, YAML source scaffold, and selector reference documentation.

## Requirements

### Requirement: Scrape Brit product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents text from product pages on `brit-petfood.com` using Cheerio selectors. The title is extracted via `h1[itemprop="name"]`, the ingredients description via `p.composition` (with the `Composition:` label stripped), and the analytical constituents via a `findLabelledParagraph` helper that locates `<p>` elements by their `<strong>` label text.

#### Scenario: Title is extracted from h1[itemprop="name"]
- **WHEN** a `brit-petfood.com` product page is scraped and an `h1[itemprop="name"]` element is present
- **THEN** the result SHALL contain the trimmed text content of that element as the product title

#### Scenario: Ingredients description is extracted from p.composition
- **WHEN** a `brit-petfood.com` product page is scraped and a `p.composition` element is present
- **THEN** the result SHALL contain the text of `p.composition` with the `<strong>Composition:</strong>` label removed and the remainder trimmed, as the ingredients description

#### Scenario: p.composition is missing
- **WHEN** a `brit-petfood.com` product page is scraped and no `p.composition` element is found
- **THEN** the ingredients description SHALL be an empty string

#### Scenario: Analytical constituents extracted from Analytical ingredients paragraph
- **WHEN** a `brit-petfood.com` product page is scraped and a `<p>` containing `<strong>Analytical ingredients:</strong>` is present
- **THEN** the result SHALL contain the trimmed text of that paragraph with the `<strong>` label stripped, as the analytical constituents text

#### Scenario: Metabolizable energy appended to analytical constituents
- **WHEN** a `brit-petfood.com` product page is scraped and both the `Analytical ingredients:` paragraph and the `Metabolizable energy:` paragraph are present
- **THEN** the analytical constituents text SHALL include the analytical ingredients text followed by the metabolizable energy text, separated by a newline

#### Scenario: Analytical ingredients paragraph is absent
- **WHEN** a `brit-petfood.com` product page is scraped and no `<p>` with a `<strong>Analytical ingredients:</strong>` child is found
- **THEN** the analytical constituents text SHALL be an empty string

### Requirement: Source registry dispatches Brit URLs
The source registry SHALL route any URL containing `brit-petfood.com` to the Brit scraper.

#### Scenario: Brit URL is dispatched to Brit scraper
- **WHEN** `findSource` is called with a URL containing `brit-petfood.com`
- **THEN** the returned entry SHALL use the `scrapeBrit` function and have `brand` set to `"Brit"`

### Requirement: Brit source YAML defines product URL scaffold
The scraper SHALL have a source file at `scraper/sources/brit.yaml` with `scraper: brit`, `domain: brit-petfood.com`, and product lists for food types `dry`, `wet`, `treats`, and `misc`. A `productCounts` map SHALL be present and SHALL match the length of each product list.

#### Scenario: Brit YAML is loaded without error
- **WHEN** `loadSourceUrls` is called with `brit.yaml` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: productCounts totals match list lengths
- **WHEN** `brit.yaml` is read
- **THEN** each value in `productCounts` SHALL equal the length of the corresponding `products` list, and `productCounts.total` SHALL equal the sum of all per-category counts

### Requirement: Brit selector reference documents HTML selectors
A file at `scraper/sources/brit.selectors.md` SHALL document the homepage URL, a representative HTML snippet from a `brit-petfood.com` product page, and the selectors used to extract title, ingredients description, and analytical constituents.

#### Scenario: Selector reference exists for Brit
- **WHEN** `scraper/sources/brit.selectors.md` is read
- **THEN** it SHALL contain the homepage URL, an HTML example, and a selectors table covering title, composition, and analytical constituents extraction
