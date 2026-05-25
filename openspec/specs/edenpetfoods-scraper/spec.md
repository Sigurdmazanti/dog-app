## Purpose

Define the scraping behaviour, source configuration, and selector reference for Eden Pet Foods products on `edenpetfoods.com`.

## Requirements

### Requirement: Scrape Eden Pet Foods product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `edenpetfoods.com` by calling the site's internal JSON API (`POST /api/product-page-details` with `Content-Type: application/x-www-form-urlencoded` and body `sku=<sku>`), because the site is an AngularJS SPA that does not render product data in its server-side HTML. The SKU SHALL be extracted from the URL path using the pattern `/shop/product/<sku>[/optional-slug]`. The title MUST be taken from `Response.product.display_name` (falling back to `name`). The ingredients description MUST be taken from `attributeContent.composition` with HTML stripped. The composition text MUST be assembled from `attributeContent.analytical`, `attributeContent.nutritional`, and `attributeContent.trace-elements`, with HTML stripped from each and sections joined with `\n`.

#### Scenario: Title is extracted from the API response
- **WHEN** an `edenpetfoods.com` product page is scraped
- **THEN** the scraper SHALL call `POST /api/product-page-details` with the SKU extracted from the URL and return `Response.product.display_name` (or `name`) as the product title

#### Scenario: Ingredients description is present
- **WHEN** the API response contains a non-null `attributeContent.composition`
- **THEN** the result SHALL contain the HTML-stripped text of that field as the ingredients description

#### Scenario: Ingredients description is absent
- **WHEN** the API response contains a null `attributeContent.composition`
- **THEN** the ingredients description SHALL be an empty string

#### Scenario: Composition text is present
- **WHEN** the API response contains non-null `attributeContent.analytical`, `nutritional`, or `trace-elements` fields
- **THEN** the result SHALL contain the HTML-stripped text of those fields joined with `\n` as the composition text

#### Scenario: Composition text is absent
- **WHEN** all of `attributeContent.analytical`, `nutritional`, and `trace-elements` are null
- **THEN** the composition text SHALL be an empty string

### Requirement: Source registry dispatches Eden Pet Foods URLs
The source registry SHALL route any URL containing `edenpetfoods.com` to the Eden Pet Foods scraper.

#### Scenario: Eden Pet Foods URL is dispatched to Eden Pet Foods scraper
- **WHEN** `findSource` is called with a URL containing `edenpetfoods.com`
- **THEN** the returned entry SHALL use the `scrapeEdenPetFoods` function and have `brand` set to `"Eden Pet Foods"`

### Requirement: Eden Pet Foods source JSON defines product groups and discovery config
The scraper SHALL have a source file at `scraper/sources/edenpetfoods.json` with `scraper: edenpetfoods`, `brand: Eden Pet Foods`, `domain: edenpetfoods.com`, a `discovery` block with `productLinkSelector` set to `.products .product figure.product-image > a`, `pagination.nextSelector` set to `.pages .pagination .paginate_button.page-item.next`, `pagination.maxPages` set to `8`, and `listings` containing all category URLs tagged with food types: dry, wet, treats, and misc. Product lists for each food type SHALL be empty arrays (populated by discovery or manually later).

#### Scenario: Eden Pet Foods JSON is loaded without error
- **WHEN** `loadSource` is called with `edenpetfoods.json` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: Discovery listings include all category URLs
- **WHEN** `edenpetfoods.json` is read
- **THEN** the `discovery.listings` array SHALL contain objects with `url` and `foodType` fields covering:
  - `?sub-category=gourmet-dry-food` → `foodType: "dry"`
  - `?sub-category=working-dog-range&format=dry` → `foodType: "dry"`
  - `?sub-category=dried-food` → `foodType: "dry"`
  - `?sub-category=wet-food` → `foodType: "wet"`
  - `?sub-category=the-semi-moist-range` → `foodType: "wet"`
  - `?format=wet` → `foodType: "wet"`
  - `?sub-category=treats_and_chews` → `foodType: "treats"`
  - `?sub-category=succulent-sausages` → `foodType: "treats"`
  - `?sub-category=training-treats` → `foodType: "treats"`
  - `?sub-category=bone-broth` → `foodType: "misc"`

#### Scenario: Pagination config is present
- **WHEN** `edenpetfoods.json` is read
- **THEN** `discovery.pagination.nextSelector` SHALL equal `.pages .pagination .paginate_button.page-item.next` and `discovery.pagination.maxPages` SHALL equal `8`

#### Scenario: Partner and physical product URLs are excluded
- **WHEN** `edenpetfoods.json` is read
- **THEN** the following URLs SHALL NOT appear in `discovery.listings` or any `products` group:
  - `https://www.edenpetfoods.com/shop/product/SRDA100GINO1MBADO/scottish-red-deer-antler-small`
  - `https://www.edenpetfoods.com/shop/product/DTTT0K120PNK1PAPDO/tin-top-trio`
  - Any URL matching `https://www.edenpetfoods.com/partners/product?sid=*`

### Requirement: Pagination uses first matching next-button element
When the discovery crawler follows pagination on an Eden Pet Foods listing page, it SHALL use the `href` of the first element matching `pagination.nextSelector`, because listing pages render the pagination widget twice (above and below the product grid), both producing identical links.

#### Scenario: Two pagination widgets are present on a listing page
- **WHEN** a listing page contains two elements matching `.pages .pagination .paginate_button.page-item.next`
- **THEN** the crawler SHALL follow the link from the first matching element and SHALL NOT treat the duplicate as a separate page link

#### Scenario: No next-button element is found
- **WHEN** a listing page contains no element matching `.pages .pagination .paginate_button.page-item.next`
- **THEN** the crawler SHALL stop paginating for that listing

### Requirement: Eden Pet Foods selector reference documents HTML selectors
A file at `scraper/sources/edenpetfoods.selectors.md` SHALL document the homepage URL, a representative HTML snippet from a product page, and the selectors used to extract title, ingredients description, and composition text from `edenpetfoods.com` product pages.

#### Scenario: Selector reference exists for Eden Pet Foods
- **WHEN** `scraper/sources/edenpetfoods.selectors.md` is read
- **THEN** it SHALL contain the homepage URL, an HTML example, and a selectors table covering title, ingredients description, and analytical constituents extraction
