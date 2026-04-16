## ADDED Requirements

### Requirement: Scrape Bosch product pages
The scraper SHALL extract a composed product title, ingredients description, and analytical constituents text from product pages on `bosch-tiernahrung.de` using Cheerio selectors targeting `div.product-brand-name a`, `h1.typo-h1`, and `div.tabs-content` panels located via `aria-controls` attributes on `ul.tabs-label-list a` tab links.

#### Scenario: Title is composed from brand link and h1
- **WHEN** a `bosch-tiernahrung.de` product page is scraped and both `div.product-brand-name a` and `h1.typo-h1` are present
- **THEN** the result SHALL contain a title formed by concatenating the brand link text with the `h1` text, separated by a single space

#### Scenario: Title falls back to h1 when brand link is absent
- **WHEN** a `bosch-tiernahrung.de` product page is scraped and `div.product-brand-name a` is not present
- **THEN** the result SHALL contain only the `h1.typo-h1` text as the title, trimmed

#### Scenario: Composition is extracted from the Composition tabpanel
- **WHEN** a `bosch-tiernahrung.de` product page is scraped
- **THEN** the result SHALL contain the ingredients description formed by reading the trimmed text content of the tabpanel whose corresponding tab link text equals `"Composition"`

#### Scenario: Composition tabpanel is located via the tab link aria-controls attribute
- **WHEN** the `"Composition"` tab link is found within `ul.tabs-label-list` and its `aria-controls` attribute is read
- **THEN** the scraper SHALL select the tabpanel by that ID, not by positional index

#### Scenario: Analytical constituents are extracted from the Analytical components tabpanel
- **WHEN** a `bosch-tiernahrung.de` product page is scraped
- **THEN** the result SHALL contain the analytical constituents text formed by reading the trimmed text content of the tabpanel whose corresponding tab link text equals `"Analytical components"`

#### Scenario: Supplements are appended to the analytical constituents
- **WHEN** a `bosch-tiernahrung.de` product page is scraped and the `"Supplements"` tab link is present
- **THEN** the analytical constituents text SHALL include the Supplements tabpanel text content appended after the Analytical components text, separated by a newline

#### Scenario: Analytical components tabpanel is located via the tab link aria-controls attribute
- **WHEN** the `"Analytical components"` tab link is found within `ul.tabs-label-list` and its `aria-controls` attribute is read
- **THEN** the scraper SHALL select the tabpanel by that ID, not by positional index

### Requirement: Source registry dispatches Bosch URLs
The source registry SHALL route any URL containing `bosch-tiernahrung.de` to the Bosch scraper.

#### Scenario: Bosch URL is dispatched to Bosch scraper
- **WHEN** `findSource` is called with a URL containing `bosch-tiernahrung.de`
- **THEN** the returned entry SHALL use the `scrapeBosch` function

### Requirement: Bosch source YAML defines product URL scaffold
The scraper SHALL have a source file at `scraper/sources/bosch.yaml` with `scraper: bosch`, `domain: bosch-tiernahrung.de`, and product lists for food types `dry`, `wet`, `treats`, and `misc`. A `productCounts` map SHALL be present; all counts MAY be zero when URLs have not yet been populated.

#### Scenario: Bosch YAML is loaded without error
- **WHEN** `loadSourceUrls` is called with `bosch.yaml` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: productCounts totals match list lengths
- **WHEN** `bosch.yaml` is read
- **THEN** each value in `productCounts` SHALL equal the length of the corresponding `products` list, and `productCounts.total` SHALL equal the sum of all per-category counts

### Requirement: Bosch selector reference documents HTML selectors
A file at `scraper/sources/bosch.selectors.md` SHALL document the homepage URL, a representative HTML snippet, and the selectors used to extract title, ingredients description, and analytical constituents from `bosch-tiernahrung.de` product pages.

#### Scenario: Selector reference exists for Bosch
- **WHEN** `scraper/sources/bosch.selectors.md` is read
- **THEN** it SHALL contain the homepage URL, an HTML example, and a selectors table covering title, composition, and analytical components extraction
