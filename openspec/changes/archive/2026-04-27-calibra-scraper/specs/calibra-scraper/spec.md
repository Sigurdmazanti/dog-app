## ADDED Requirements

### Requirement: Scrape Calibra product pages
The scraper SHALL extract the product title, ingredients description, and composition text from product pages on `mycalibra.eu` using Cheerio selectors targeting `h1.product-title` and the "Composition" accordion panel.

#### Scenario: Title is extracted
- **WHEN** a `mycalibra.eu` product page is scraped
- **THEN** the result SHALL contain the product name taken from `h1.product-title`, trimmed

#### Scenario: Ingredients description is extracted
- **WHEN** a `mycalibra.eu` product page is scraped
- **THEN** the result SHALL contain the ingredients description as the text appearing before `"Analytical constituents:"` in the "Composition" accordion panel, with any leading `"Composition: "` prefix stripped and the result trimmed

#### Scenario: Composition text is extracted
- **WHEN** a `mycalibra.eu` product page is scraped
- **THEN** the result SHALL contain the composition text as the portion of the "Composition" accordion panel body starting from `"Analytical constituents:"`, trimmed

#### Scenario: Composition panel is identified by accordion title text
- **WHEN** a `mycalibra.eu` product page is scraped
- **THEN** the scraper SHALL locate the accordion panel whose `summary h3.accordion__title` text is `"Composition"` rather than relying on the dynamically generated `id` attribute of the `<details>` element

#### Scenario: Product with no analytical constituents separator
- **WHEN** a `mycalibra.eu` product page is scraped and the composition body does not contain `"Analytical constituents:"`
- **THEN** the full body text SHALL be returned as the ingredients description and the composition text SHALL be an empty string

### Requirement: Calibra source YAML defines product URLs by food type
The scraper SHALL have a source file at `scraper/sources/calibra.yaml` listing product URLs grouped by food type, using `scraper: calibra`, `brand: Calibra`, and `domain: mycalibra.eu`.

#### Scenario: Calibra YAML is loaded without error
- **WHEN** `loadSourceUrls` is called with `calibra.yaml` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

### Requirement: Calibra selector reference documents HTML selectors
A file at `scraper/sources/calibra.selectors.md` SHALL document the homepage URL, a representative HTML snippet, and the selectors used to extract the title, ingredients description, and composition text from `mycalibra.eu` product pages.

#### Scenario: Selector reference file exists and documents stable selectors
- **WHEN** `scraper/sources/calibra.selectors.md` is read
- **THEN** it SHALL contain the selectors `h1.product-title`, the accordion title match strategy, and `div.accordion__content .metafield-rich_text_field`
