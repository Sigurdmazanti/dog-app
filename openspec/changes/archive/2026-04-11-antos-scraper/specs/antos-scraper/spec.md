## ADDED Requirements

### Requirement: Scrape Antos product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `antos.eu` using Cheerio selectors targeting `h1[itemprop="name"]` and the `div#specs` content block.

#### Scenario: Title is extracted
- **WHEN** an `antos.eu` product page is scraped
- **THEN** the result SHALL contain the product name taken from `h1[itemprop="name"]`, trimmed

#### Scenario: Ingredients description is extracted
- **WHEN** an `antos.eu` product page is scraped
- **THEN** the result SHALL contain the ingredients description as the inline text appearing after `<strong>Composition</strong>` and before `<strong>Analytical Constituents</strong>` inside `div#specs`, trimmed

#### Scenario: Composition text is extracted
- **WHEN** an `antos.eu` product page is scraped
- **THEN** the result SHALL contain composition text built from the rows of `div#specs table`, formatted as `Label: value` pairs joined by `; `

#### Scenario: Promotional link text is excluded
- **WHEN** an `antos.eu` product page is scraped
- **THEN** the result SHALL NOT include text from the trailing `<a>` element in `div#specs`

### Requirement: Source registry dispatches Antos URLs
The source registry SHALL route any URL containing `antos.eu` to the Antos scraper.

#### Scenario: Antos URL is dispatched to Antos scraper
- **WHEN** `findSource` is called with a URL containing `antos.eu`
- **THEN** the returned entry SHALL use the `scrapeAntos` function
