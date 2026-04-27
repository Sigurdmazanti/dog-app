## ADDED Requirements

### Requirement: Canex scraper extracts product title
The scraper SHALL extract the product title from the `h1.product-title` element on each canex-shop.dk product page.

#### Scenario: Standard product page with title
- **WHEN** the scraper fetches a canex-shop.dk product URL
- **THEN** the returned `title` field SHALL contain the text content of the `h1.product-title` element, trimmed of whitespace

### Requirement: Canex scraper extracts ingredient description from accordion
The scraper SHALL extract the ingredient list from the "Sammensætning" (Composition) accordion section on the product page.

#### Scenario: Product page with composition accordion
- **WHEN** the product page contains an accordion item with the label "Sammensætning"
- **THEN** the scraper SHALL extract all paragraph text preceding the analytical table from that accordion's content as the raw `ingredientsDescription`

#### Scenario: Product page without composition accordion (treats)
- **WHEN** the product page has no "Sammensætning" accordion but has a `.product-short-description` containing ingredient/composition text
- **THEN** the scraper SHALL extract the ingredient text from the `.product-short-description` element

### Requirement: Canex scraper extracts analytical composition text
The scraper SHALL extract analytical composition values and combine them with the ingredient description into a single `compositionText` string for the AI mapper.

#### Scenario: Product page with analytical table in accordion
- **WHEN** the "Sammensætning" accordion contains a `<table>` with analytical values (e.g., "Råprotein: 27%")
- **THEN** the scraper SHALL extract each table row as "label: value" pairs and combine them with the ingredient description into the `compositionText`

#### Scenario: Product page with inline analysis in short description
- **WHEN** the product page has analytical values inline in `.product-short-description` (e.g., "Analyse: Vand (22,5%), råprotein (9%)...")
- **THEN** the scraper SHALL extract these values and include them in the `compositionText`

### Requirement: Canex source YAML lists all products
The source YAML SHALL contain all 44 product URLs (20 dry, 24 treats) with correct food-type categorization.

#### Scenario: Source YAML product counts
- **WHEN** the `canex.yaml` source file is loaded
- **THEN** it SHALL contain exactly 20 URLs under `dry` and 24 URLs under `treats`, with `total` equal to 44

### Requirement: Canex domain is registered in source registry
The source registry SHALL map the `canex-shop.dk` domain to the Canex scraper function with brand name "Canex".

#### Scenario: URL matching for Canex domain
- **WHEN** a URL containing `canex-shop.dk` is passed to `findSource`
- **THEN** the function SHALL return the Canex source entry with `brand: "Canex"` and the `scrapeCanex` function

### Requirement: Canex selector reference is documented
A selector reference document SHALL be created at `scraper/sources/canex.selectors.md` documenting all CSS selectors used by the scraper.

#### Scenario: Selector reference contains all extraction selectors
- **WHEN** the selector reference file is reviewed
- **THEN** it SHALL document selectors for: product title, ingredient description (accordion and short-description fallback), and analytical composition table
