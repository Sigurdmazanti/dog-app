## ADDED Requirements

### Requirement: Scrape Belcando product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents (including additives) from product pages on `belcando.com` using Cheerio selectors targeting `h1[itemprop="name"]` and the `.product-detail-analyse-text` composition columns matched by `<strong>` label text.

#### Scenario: Title is extracted from h1 with itemprop=name
- **WHEN** a `belcando.com` product page is scraped and `h1[itemprop="name"]` is present
- **THEN** the result SHALL contain the trimmed text of that element as the product title

#### Scenario: Ingredients description is extracted from the Composition column
- **WHEN** a `belcando.com` product page is scraped
- **THEN** the result SHALL contain the text from the `.col-md` element inside `.product-detail-analyse-text .row.mb-3` whose `<strong>` child text is `Composition`, with the `<strong>` label removed and the remaining text trimmed

#### Scenario: Analytical constituents are extracted from the Analytical constituents column
- **WHEN** a `belcando.com` product page is scraped
- **THEN** the result SHALL contain the analytical constituents text from the `.col-md` element whose `<strong>` child text is `Analytical constituents`, with the label removed and the remaining text trimmed

#### Scenario: Additives text is included in composition output
- **WHEN** a `belcando.com` product page is scraped and an "Additives per kg" column is present
- **THEN** the composition text field SHALL include both the analytical constituents and the additives text, joined with a newline

#### Scenario: Missing column is handled gracefully
- **WHEN** a `belcando.com` product page does not contain a column matching a given label
- **THEN** that field SHALL be returned as an empty string without throwing an error

### Requirement: Source registry dispatches Belcando URLs
The source registry SHALL route any URL containing `belcando.com` to the Belcando scraper.

#### Scenario: Belcando URL is dispatched to Belcando scraper
- **WHEN** `findSource` is called with a URL containing `belcando.com`
- **THEN** the returned entry SHALL use the `scrapeBelcando` function

### Requirement: Belcando source YAML defines product URLs by food type
The scraper SHALL have a source file at `scraper/sources/belcando.yaml` listing product URLs grouped by food type, using `scraper: belcando`, `brand: Belcando`, and `domain: belcando.com`.

#### Scenario: Belcando YAML is loaded without error
- **WHEN** `loadSourceUrls` is called with `belcando.yaml` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

### Requirement: Belcando selector reference documents HTML selectors
A file at `scraper/sources/belcando.selectors.md` SHALL document the homepage URL, a representative HTML snippet from the provided markup, and the selectors used to extract title, ingredients description, and analytical constituents from `belcando.com` product pages.

#### Scenario: Selector reference exists for Belcando
- **WHEN** `belcando.ts` is registered in `sourceRegistry.ts`
- **THEN** `scraper/sources/belcando.selectors.md` SHALL exist and contain a representative HTML snippet showing `h1[itemprop="name"]` and the `.product-detail-analyse-text` composition column structure
