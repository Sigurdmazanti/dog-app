## ADDED Requirements

### Requirement: Advance scraper extracts product data
The system MUST provide a scraper module for advancepet.com.au that extracts the product title, ingredients list, and nutritional/analytical constituent text from a product page.

#### Scenario: Successful Advance product scrape
- **WHEN** the scraper receives a URL containing `advancepet.com`
- **THEN** it returns a `ScrapeResult` with `title` from `.product-title`, `ingredientsDescription` from `.ings-content .metafield-rich_text_field`, and composition data mapped via the AI composition mapper

#### Scenario: Advance nutritional table is parsed
- **WHEN** the product page contains a `.nutritional-table table` element
- **THEN** the scraper extracts all label-value pairs from table rows and includes them in the text sent to the AI composition mapper

### Requirement: Almo Nature scraper extracts product data
The system MUST provide a scraper module for almonature.com that extracts the product title, ingredients, analytical constituents, and additives text from a product page.

#### Scenario: Successful Almo Nature product scrape
- **WHEN** the scraper receives a URL containing `almonature.com`
- **THEN** it returns a `ScrapeResult` with `title` composed from `.product-category` and `.product-flavor` spans, `ingredientsDescription` from `#composition`, and composition data mapped via the AI composition mapper

#### Scenario: Almo Nature analytical constituents are parsed
- **WHEN** the product page contains a `#constituents ul` element
- **THEN** the scraper extracts all list item text and includes it in the composition text

### Requirement: Amanova scraper extracts product data
The system MUST provide a scraper module for amanova.com (Shopify) that extracts the product title, ingredients, and components text from a product page.

#### Scenario: Successful Amanova product scrape
- **WHEN** the scraper receives a URL containing `amanova`
- **THEN** it returns a `ScrapeResult` with `title` composed from `#title-product` and `.product__text`, `ingredientsDescription` from the Ingredients accordion content, and composition data mapped via the AI composition mapper

#### Scenario: Amanova components accordion is parsed
- **WHEN** the product page contains accordion sections with "Ingredients" and "Components" headings
- **THEN** the scraper extracts text from both accordion bodies and includes all of it in the composition text

### Requirement: Animonda scraper extracts product data
The system MUST provide a scraper module for animonda.com that extracts the product title, composition ingredients, analytical constituents, and nutritional additives from a product page.

#### Scenario: Successful Animonda product scrape
- **WHEN** the scraper receives a URL containing `animonda`
- **THEN** it returns a `ScrapeResult` with `title` from `.product-detail-title`, `ingredientsDescription` from `.product-detail-composition__main-content`, and composition data mapped via the AI composition mapper

#### Scenario: Animonda analytical constituents are parsed
- **WHEN** the product page contains `.product-detail-ingredients__list` items
- **THEN** the scraper extracts description-value pairs and includes them in the composition text

#### Scenario: Animonda nutritional additives are parsed
- **WHEN** the product page contains `.product-detail-nutritional-additives__list` items
- **THEN** the scraper extracts additive text and includes it in the composition text

### Requirement: All scrapers delegate to AI composition mapper
Every brand scraper MUST concatenate all extracted composition-related text and pass it to `mapProductCompositionWithAI()` to produce the structured composition sections.

#### Scenario: Composition text is mapped to structured output
- **WHEN** any new brand scraper has finished extracting raw text
- **THEN** it calls `mapProductCompositionWithAI()` with the concatenated text and returns the mapped sections in the `ScrapeResult`
