## ADDED Requirements

### Requirement: Scrape Bellfor product pages
The scraper SHALL extract a product title, ingredients description, and analytical constituents (including nutritional additives) from product pages on `bellfor.info` using Cheerio selectors targeting `h1.product-page-heading` for the title, the second `.tab-pane` child of `.product-tabs-contents` for the ingredients paragraph, and the `table.table-margin` elements inside the first `.tab-pane` for the analytical data tables.

#### Scenario: Title is extracted from the product heading
- **WHEN** a `bellfor.info` product page is scraped and `h1.product-page-heading` is present
- **THEN** the result SHALL contain the trimmed text of `h1.product-page-heading` as the product title

#### Scenario: Title falls back to empty string when heading is absent
- **WHEN** a `bellfor.info` product page is scraped and `h1.product-page-heading` is absent
- **THEN** the result SHALL contain an empty string as the product title without throwing an error

#### Scenario: Ingredients description is extracted from the second tab
- **WHEN** a `bellfor.info` product page is scraped
- **THEN** the result SHALL contain the trimmed text of the `<p>` element inside the second `.product-tabs-contents .tab-pane` child as the ingredients description

#### Scenario: Analytical constituents are extracted from the first tab tables
- **WHEN** a `bellfor.info` product page is scraped and the first `.tab-pane` contains `table.table-margin` elements with data rows
- **THEN** the composition text SHALL include each table's section header followed by its key-value rows formatted as `"Key: Value"` lines, joined by newlines

#### Scenario: Nutritional additives are included in composition output
- **WHEN** a `bellfor.info` product page is scraped and a second `table.table-margin` for nutritional additives is present in the first tab
- **THEN** the composition text SHALL include both the basic values section and the nutritional additives section, joined with a newline

#### Scenario: Missing tab content is handled gracefully
- **WHEN** a `bellfor.info` product page does not contain expected tab pane content
- **THEN** the missing field SHALL be returned as an empty string without throwing an error

### Requirement: Source registry dispatches Bellfor URLs
The source registry SHALL route any URL containing `bellfor.info` to the Bellfor scraper.

#### Scenario: Bellfor URL is dispatched to Bellfor scraper
- **WHEN** `findSource` is called with a URL containing `bellfor.info`
- **THEN** the returned entry SHALL use the `scrapeBellfor` function

### Requirement: Bellfor source YAML defines product URLs by food type
The scraper SHALL have a source file at `scraper/sources/bellfor.yaml` listing product URLs grouped by food type, using `scraper: bellfor`, `brand: Bellfor`, and `domain: bellfor.info`.

#### Scenario: Bellfor YAML is loaded without error
- **WHEN** `loadSourceUrls` is called with `bellfor.yaml` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

### Requirement: Bellfor selector reference documents HTML selectors
A file at `scraper/sources/bellfor.selectors.md` SHALL document the homepage URL, a representative HTML snippet from the provided markup, and the selectors used to extract title, ingredients description, and analytical constituents from `bellfor.info` product pages.

#### Scenario: Selector reference exists for Bellfor
- **WHEN** `bellfor.ts` is registered in `sourceRegistry.ts`
- **THEN** `scraper/sources/bellfor.selectors.md` SHALL exist and contain a representative HTML snippet showing `h1.product-page-heading`, `.product-tabs-contents .tab-pane` with the analytical tables and ingredients `<p>`, and the Selectors table SHALL document the positional tab approach for the Ingredients and Analytical constituents fields
