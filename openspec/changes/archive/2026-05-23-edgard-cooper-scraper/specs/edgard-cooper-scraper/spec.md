## ADDED Requirements

### Requirement: Scrape Edgard & Cooper product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `edgardcooper.com` using Cheerio against the server-rendered HTML. The title SHALL be taken from the first `h1.font-imperfect` element. The ingredients description SHALL be the text content of the HeadlessUI Disclosure panel associated with the "Composition" button (found by iterating `<button>` elements and matching the button's text to `"Composition"`, then reading the text of the panel container). The composition text SHALL be the text content of the Disclosure panel associated with the "Nutritional Info" button, joined after the ingredients description with `\n` when both are present.

#### Scenario: Title is extracted from the product page
- **WHEN** an `edgardcooper.com` product page is scraped
- **THEN** the scraper SHALL return the text of `h1.font-imperfect` as the product title

#### Scenario: Composition (ingredients) panel is present in the HTML
- **WHEN** the static HTML contains a `<button>` whose text starts with `"Composition"` followed by a sibling panel element containing ingredient text
- **THEN** the result SHALL contain that panel's text as the ingredients description

#### Scenario: Composition panel is absent
- **WHEN** no `<button>` with text `"Composition"` is found, or the adjacent panel is empty
- **THEN** the ingredients description SHALL be an empty string

#### Scenario: Nutritional Info panel is present in the HTML
- **WHEN** the static HTML contains a `<button>` whose text starts with `"Nutritional Info"` followed by a sibling panel element containing analytical data
- **THEN** the result SHALL contain that panel's text as part of the composition text

#### Scenario: Nutritional Info panel is absent
- **WHEN** no `<button>` with text `"Nutritional Info"` is found, or the adjacent panel is empty
- **THEN** the composition text SHALL equal the ingredients description alone (no trailing `\n`)

#### Scenario: Bundle or variety-pack page has no composition data
- **WHEN** a product URL resolves to a bundle page with no Composition or Nutritional Info panels
- **THEN** both ingredients description and composition text SHALL be empty strings and the scraper SHALL NOT throw

### Requirement: Source registry dispatches Edgard & Cooper URLs
The source registry SHALL route any URL containing `edgardcooper.com` to the Edgard & Cooper scraper.

#### Scenario: Edgard & Cooper URL is dispatched to Edgard & Cooper scraper
- **WHEN** `findSource` is called with a URL containing `edgardcooper.com`
- **THEN** the returned entry SHALL use the `scrapeEdgardCooper` function and have `brand` set to `"Edgard & Cooper"`

### Requirement: Edgard & Cooper source JSON defines product groups and discovery config
The scraper SHALL have a source file at `scraper/sources/edgard-cooper.json` with `scraper: edgard-cooper`, `brand: Edgard & Cooper`, `domain: edgardcooper.com`, a `discovery` block with `productLinkSelector` set to `.container div.grid > a`, no `pagination` block (no pagination on any listing page), and `listings` containing the four category URLs tagged with food types. Product lists for each food type SHALL be populated with the URLs provided.

#### Scenario: Source JSON is loaded without error
- **WHEN** `loadSource` is called with `edgard-cooper.json` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: Discovery listings include all category URLs
- **WHEN** `edgard-cooper.json` is read
- **THEN** the `discovery.listings` array SHALL contain objects with `url` and `foodType` covering:
  - `https://www.edgardcooper.com/en/collections/dogs/?type-group=dry-food` → `foodType: "dry"`
  - `https://www.edgardcooper.com/en/collections/dogs/?type-group=wet-food` → `foodType: "wet"`
  - `https://www.edgardcooper.com/en/collections/dogs/?type-group=treats` → `foodType: "treats"`
  - `https://www.edgardcooper.com/en/collections/dogs/?type-group=dental` → `foodType: "misc"`

#### Scenario: All four food type product lists are populated
- **WHEN** `edgard-cooper.json` is read
- **THEN** `products.dry`, `products.wet`, `products.treats`, and `products.misc` SHALL each be non-empty arrays of URL strings
