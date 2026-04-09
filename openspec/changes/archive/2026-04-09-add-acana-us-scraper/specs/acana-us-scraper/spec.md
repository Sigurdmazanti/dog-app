## ADDED Requirements

### Requirement: Scrape Acana US product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `www.acana.com` using the same Cheerio selectors as the Acana EU scraper.

#### Scenario: Title is extracted
- **WHEN** a `www.acana.com` product page is scraped
- **THEN** the result SHALL contain the product name taken from `h3.product-name.show-desktop` (text nodes only, trimmed)

#### Scenario: Ingredients description is extracted
- **WHEN** a `www.acana.com` product page is scraped
- **THEN** the result SHALL contain the ingredients description taken from the first `p` element inside `.ingredients-list`, trimmed

#### Scenario: Composition text is extracted
- **WHEN** a `www.acana.com` product page is scraped
- **THEN** the result SHALL contain composition text that is the concatenation of all non-first `.ingredients-list p` elements and the `.analysis` block, trimmed

### Requirement: Source registry dispatches Acana US URLs
The source registry SHALL route any URL containing `www.acana.com` to the Acana US scraper and SHALL NOT route it to the Acana EU scraper.

#### Scenario: US URL is dispatched to US scraper
- **WHEN** `findSource` is called with a URL containing `www.acana.com`
- **THEN** the returned entry SHALL use the `scrapeAcanaUs` function

#### Scenario: EU URL is not affected
- **WHEN** `findSource` is called with a URL containing `emea.acana.com`
- **THEN** the returned entry SHALL use the `scrapeAcanaEu` function and SHALL NOT use `scrapeAcanaUs`
