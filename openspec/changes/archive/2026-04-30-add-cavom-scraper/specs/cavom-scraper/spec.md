## ADDED Requirements

### Requirement: Scrape Cavom product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `cavom.com` using Cheerio selectors targeting `h1.entry-title.product_title` for the title and the `div.m-productTab` block whose heading is "Composition" for the ingredient and analytical content.

#### Scenario: Title is extracted
- **WHEN** a `cavom.com` product page is scraped
- **THEN** the result SHALL contain the product name taken from `h1.entry-title.product_title`, trimmed

#### Scenario: Composition tab is located by heading text
- **WHEN** the scraper parses a `cavom.com` product page
- **THEN** it SHALL select the `div.m-productTab` block whose `.m-productTab__title h2` text equals "Composition" (case-insensitive)

#### Scenario: Ingredients description is extracted
- **WHEN** a `cavom.com` product page is scraped
- **THEN** the result SHALL contain the ingredients description taken from the paragraph(s) following the `<strong>Composition</strong>` sub-heading inside the Composition tab's `.m-productTab__text`, trimmed

#### Scenario: Composition text is extracted
- **WHEN** a `cavom.com` product page is scraped
- **THEN** the result SHALL contain composition text built from the paragraph(s) following the `<strong>Analytical Constituents</strong>` sub-heading concatenated with the paragraph(s) following the `<strong>Nutritional Additives</strong>` sub-heading, joined by newline

#### Scenario: Sub-section boundaries are respected
- **WHEN** the scraper extracts a sub-section from the Composition tab
- **THEN** it SHALL stop accumulating paragraph text when it encounters the next `<p><strong>...</strong></p>` heading marker

### Requirement: Source registry dispatches Cavom URLs
The source registry SHALL route any URL containing `cavom.com` to the Cavom scraper.

#### Scenario: Cavom URL is dispatched to Cavom scraper
- **WHEN** `findSource` is called with a URL containing `cavom.com`
- **THEN** the returned entry SHALL use the `scrapeCavom` function
