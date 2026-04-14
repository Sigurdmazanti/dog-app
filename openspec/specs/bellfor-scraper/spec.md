## Purpose

Define the scraping behaviour, source configuration, and selector reference for Bellfor pet food products on `bellfor.info`.

## Requirements

### Requirement: Scrape Bellfor product pages
The scraper SHALL extract a product title, ingredients description, and composition text (ingredients, additives, and nutrient analysis) from product pages on `bellfor.info` using Cheerio selectors targeting `h1.product-page-heading` for the title, and resolving tab pane content by matching tab label text from `ul.product-tabs-buttons` against `/ingredients/i`, `/additives/i`, and `/nutrient/i` patterns to find the corresponding pane ID via the nav link `href` attribute.

#### Scenario: Title is extracted from the product heading
- **WHEN** a `bellfor.info` product page is scraped and `h1.product-page-heading` is present
- **THEN** the result SHALL contain the trimmed text of `h1.product-page-heading` as the product title

#### Scenario: Title falls back to empty string when heading is absent
- **WHEN** a `bellfor.info` product page is scraped and `h1.product-page-heading` is absent
- **THEN** the result SHALL contain an empty string as the product title without throwing an error

#### Scenario: Ingredients description is extracted from the Ingredients tab
- **WHEN** a `bellfor.info` product page is scraped and a tab labelled matching `/ingredients/i` exists
- **THEN** the result SHALL contain the trimmed text of that tab's pane as the ingredients description

#### Scenario: Additives are included in composition output
- **WHEN** a `bellfor.info` product page is scraped and a tab labelled matching `/additives/i` exists
- **THEN** the composition text SHALL include the text of that tab's pane

#### Scenario: Nutrient analysis is included in composition output
- **WHEN** a `bellfor.info` product page is scraped and a tab labelled matching `/nutrient/i` exists
- **THEN** the composition text SHALL include the text of that tab's pane

#### Scenario: Missing tab content is handled gracefully
- **WHEN** a `bellfor.info` product page does not contain a tab matching a given label pattern
- **THEN** that field SHALL be returned as an empty string without throwing an error

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
A file at `scraper/sources/bellfor.selectors.md` SHALL document the homepage URL, a representative HTML snippet including `h1.product-page-heading`, the `ul.product-tabs-buttons` nav with tab labels and `href` anchors, and the `.product-tabs-contents .tab-pane` structure, and a Selectors table documenting the label-based tab resolution approach for Title, Ingredients description, Additives, and Nutrient analysis fields.

#### Scenario: Selector reference exists for Bellfor
- **WHEN** `bellfor.ts` is registered in `sourceRegistry.ts`
- **THEN** `scraper/sources/bellfor.selectors.md` SHALL exist and document the `ul.product-tabs-buttons` label-to-pane-ID resolution strategy
