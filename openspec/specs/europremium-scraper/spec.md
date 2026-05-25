## Purpose

Define the scraping behaviour, source configuration, and selector reference for EuroPremium products on `europremium.com`.

## Requirements

### Requirement: Scrape EuroPremium product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `europremium.com`. Product data is server-rendered inside `.product-components__content` elements identified by `san-id` attributes. The title SHALL be taken from the first `h1` element. The ingredients description SHALL be the trimmed text of `.product-components__content[san-id="open-Composition"]`. The composition text SHALL be the trimmed text of `.product-components__content[san-id="open-Analytical components"]`.

#### Scenario: Title is extracted from the product page
- **WHEN** a `europremium.com` product page is scraped
- **THEN** the scraper SHALL return the trimmed text of the first `h1` element as the product title

#### Scenario: Ingredients description is extracted from the Composition panel
- **WHEN** the product page contains `.product-components__content[san-id="open-Composition"]`
- **THEN** the scraper SHALL return its trimmed text content as the ingredients description

#### Scenario: Composition panel is absent
- **WHEN** the product page has no element matching `[san-id="open-Composition"]`
- **THEN** `extractIngredientsDescription` SHALL return an empty string and SHALL NOT throw

#### Scenario: Analytical components are extracted as composition text
- **WHEN** the product page contains `.product-components__content[san-id="open-Analytical components"]`
- **THEN** the scraper SHALL return its trimmed text content as the composition text

#### Scenario: Analytical components panel is absent
- **WHEN** the product page has no element matching `[san-id="open-Analytical components"]`
- **THEN** `extractCompositionText` SHALL return an empty string and SHALL NOT throw

### Requirement: Source registry dispatches EuroPremium URLs
The source registry SHALL route any URL containing `europremium.com` to the EuroPremium scraper.

#### Scenario: EuroPremium URL is dispatched to the correct scraper
- **WHEN** `findSource` is called with a URL containing `europremium.com`
- **THEN** the returned entry SHALL use the `scrapeEuroPremium` function and have `brand` set to `"EuroPremium"`

### Requirement: EuroPremium source JSON defines product groups and discovery config
The scraper SHALL have a source file at `scraper/sources/europremium.json` with `scraper: europremium`, `brand: EuroPremium`, `domain: europremium.com`, a `discovery` block with `productLinkSelector` set to `.products .products--grid a.products__item`, `pagination` set to `{ "nextSelector": ".products .pagination .pagination__item:last-of-type", "pages": 3 }`, one `listings` entry for `https://europremium.com/en/products` with `foodType: "dry"`, and `products` sections for `dry`, `wet`, `treats`, and `misc` fully populated with the provided URLs.

#### Scenario: Source JSON is loaded without error
- **WHEN** `loadSource` is called with `europremium.json` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: Discovery listing is present
- **WHEN** `europremium.json` is read
- **THEN** the `discovery.listings` array SHALL contain exactly one entry with `url: "https://europremium.com/en/products"` and `foodType: "dry"`

#### Scenario: Dry product list is populated
- **WHEN** `europremium.json` is read
- **THEN** `products.dry` SHALL be a non-empty array containing the 20 dry kibble product URLs

#### Scenario: Wet product list is populated
- **WHEN** `europremium.json` is read
- **THEN** `products.wet` SHALL be a non-empty array containing the 7 wet/pâté product URLs

#### Scenario: Treats product list is populated
- **WHEN** `europremium.json` is read
- **THEN** `products.treats` SHALL be a non-empty array containing the 4 snack product URLs

#### Scenario: Misc product list is populated
- **WHEN** `europremium.json` is read
- **THEN** `products.misc` SHALL be a non-empty array containing the MSM glucosamine tablet URL

### Requirement: EuroPremium selector reference is documented
The scraper SHALL have a selector reference file at `scraper/sources/europremium.selectors.md` documenting the HTML structure and CSS selectors used for title, ingredients description, and analytical composition extraction.

#### Scenario: Selector reference file exists
- **WHEN** the `scraper/sources/` directory is read
- **THEN** `europremium.selectors.md` SHALL be present and SHALL contain a selector table covering at minimum the title, composition, and analytical components fields
