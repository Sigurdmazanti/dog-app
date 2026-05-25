## Purpose

Define the scraping behaviour, source configuration, and selector reference for Edgard & Cooper products on `edgardcooper.com`.

## Requirements

### Requirement: Scrape Edgard & Cooper product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `edgardcooper.com`. The site uses Next.js App Router with React Server Components; product data is embedded in `self.__next_f.push` script tags as a double-escaped RSC payload — the HeadlessUI Disclosure panels are collapsed server-side and their content is not in the static HTML. The title SHALL be taken from `h1.font-imperfect`. The ingredients description SHALL be the value of the `composition` key in the RSC payload script. The composition text SHALL join the `composition`, `analyticalConstituents`, `nutritionalAdditives`, and `technologicalAdditives` values with `\n`, filtering out empty or whitespace-only values.

#### Scenario: Title is extracted from the product page
- **WHEN** an `edgardcooper.com` product page is scraped
- **THEN** the scraper SHALL return the text of `h1.font-imperfect` as the product title

#### Scenario: Composition (ingredients) is present in the RSC payload
- **WHEN** the page HTML contains a `self.__next_f.push` script with a `\"composition\":\"...\"` key
- **THEN** the result SHALL contain that value as the ingredients description

#### Scenario: Composition key is absent
- **WHEN** no `\"composition\":\"` marker is found in any script tag
- **THEN** the ingredients description SHALL be an empty string

#### Scenario: Analytical constituents are present in the RSC payload
- **WHEN** the page HTML contains a `self.__next_f.push` script with a `\"analyticalConstituents\":\"...\"` key
- **THEN** the result SHALL include that value in the composition text

#### Scenario: Nutritional/technological additives are present
- **WHEN** `\"nutritionalAdditives\"` or `\"technologicalAdditives\"` keys are present in the RSC payload
- **THEN** their values SHALL be included in the composition text, joined with `\n`

#### Scenario: Bundle or variety-pack page has no composition data
- **WHEN** a product URL resolves to a bundle page with no RSC payload keys for composition data
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
