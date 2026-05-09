## ADDED Requirements

### Requirement: Scrape Chrisco product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents text from product pages on `chrisco.dk` using Cheerio selectors. The title SHALL be extracted from `h1.page-title`. The nutritional content SHALL be extracted from the tab panel whose corresponding `a.data.switch` tab link text equals `"Næringsindhold"`, located via the link's `href` attribute.

#### Scenario: Title is extracted from h1.page-title
- **WHEN** a `chrisco.dk` product page is scraped and `h1.page-title` is present
- **THEN** the result SHALL contain the trimmed text content of `h1.page-title` as the title

#### Scenario: Ingredients description is extracted from the Næringsindhold tab panel
- **WHEN** a `chrisco.dk` product page is scraped and the `"Næringsindhold"` tab link is present
- **THEN** the result SHALL contain the trimmed text content of the corresponding panel as the ingredients description

#### Scenario: Composition text is extracted from the Næringsindhold tab panel
- **WHEN** a `chrisco.dk` product page is scraped
- **THEN** the result SHALL contain the trimmed text content of the `"Næringsindhold"` panel as the composition text passed to the AI mapper

#### Scenario: Tab panel is located via href attribute on the tab link
- **WHEN** the `"Næringsindhold"` tab link `a.data.switch` is found and its `href` attribute is read
- **THEN** the scraper SHALL select the panel by that ID (with `#` stripped), not by positional index

#### Scenario: Empty string returned when Næringsindhold tab is absent
- **WHEN** a `chrisco.dk` product page is scraped and no `a.data.switch` element with text `"Næringsindhold"` exists
- **THEN** the ingredients description and composition text SHALL both be empty strings

### Requirement: Source registry dispatches Chrisco URLs
The source registry SHALL route any URL containing `chrisco.dk` to the Chrisco scraper.

#### Scenario: Chrisco URL is dispatched to Chrisco scraper
- **WHEN** `findSource` is called with a URL containing `chrisco.dk`
- **THEN** the returned entry SHALL use the `scrapeChrisco` function

### Requirement: Chrisco source JSON defines product URL scaffold
The scraper SHALL have a source file at `scraper/sources/chrisco.json` with `scraper: chrisco`, `domain: chrisco.dk`, and product lists for food types `dry`, `wet`, and `treats`.

#### Scenario: Chrisco JSON is loaded without error
- **WHEN** `loadSource` is called with `chrisco.json` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

### Requirement: Chrisco selector reference documents HTML selectors
A file at `scraper/sources/chrisco.selectors.md` SHALL document the homepage URL, a representative HTML snippet, and the selectors used to extract title, ingredients description, and analytical constituents from `chrisco.dk` product pages.

#### Scenario: Selector reference exists for Chrisco
- **WHEN** `scraper/sources/chrisco.selectors.md` is read
- **THEN** it SHALL contain the homepage URL, an HTML example, and a selectors table covering title, composition, and analytical components extraction
