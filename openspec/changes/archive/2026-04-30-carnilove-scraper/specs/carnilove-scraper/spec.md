## ADDED Requirements

### Requirement: Scrape Carnilove product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `carnilove.com` using Cheerio selectors targeting `h1 .heading__text` for the title, `tray-component[data-tray-id="tray-ingredients"]` for ingredients, and `tray-component[data-tray-id="tray-nutrition"]` for nutrition data.

#### Scenario: Title is extracted
- **WHEN** a `carnilove.com` product page is scraped
- **THEN** the result SHALL contain the product name taken from `h1 .heading__text`, trimmed

#### Scenario: Ingredients description is extracted
- **WHEN** a `carnilove.com` product page is scraped
- **THEN** the result SHALL contain the ingredients description as the text content within the `tray-component[data-tray-id="tray-ingredients"]` tray's `.tray__content` area, trimmed

#### Scenario: Composition text is extracted
- **WHEN** a `carnilove.com` product page is scraped
- **THEN** the result SHALL contain composition text built from the ingredients description combined with the paragraph text within the `tray-component[data-tray-id="tray-nutrition"]` tray's `.tray__content` area, joined by newline

#### Scenario: Astro build-hash attributes are not used in selectors
- **WHEN** the scraper targets elements on `carnilove.com`
- **THEN** selectors SHALL NOT rely on `data-astro-cid-*` attributes

### Requirement: Source registry dispatches Carnilove URLs
The source registry SHALL route any URL containing `carnilove.com` to the Carnilove scraper.

#### Scenario: Carnilove URL is dispatched to Carnilove scraper
- **WHEN** `findSource` is called with a URL containing `carnilove.com`
- **THEN** the returned entry SHALL use the `scrapeCarnilove` function
