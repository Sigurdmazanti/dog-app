## ADDED Requirements

### Requirement: Scrape Alpha Spirit product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `alphaspirit.se` using Cheerio selectors. The title MUST be taken from `h1.elementor-heading-title`. The ingredients description MUST be taken from the `p` element immediately following the `h3` whose trimmed text equals `"Sammansättning"`. The composition text MUST be taken from the `p` element immediately following the `h3` whose trimmed text equals `"Analys"`.

#### Scenario: Title is extracted from h1.elementor-heading-title
- **WHEN** an `alphaspirit.se` product page is scraped
- **THEN** the result SHALL contain the trimmed text of `h1.elementor-heading-title` as the product title

#### Scenario: Ingredients description is extracted from Sammansättning section
- **WHEN** an `alphaspirit.se` product page is scraped and an `h3` with trimmed text `"Sammansättning"` is present
- **THEN** the result SHALL contain the trimmed text of the `p` element immediately following that `h3` as the ingredients description

#### Scenario: Sammansättning section is missing
- **WHEN** an `alphaspirit.se` product page is scraped and no `h3` with text `"Sammansättning"` is found
- **THEN** the ingredients description SHALL be an empty string

#### Scenario: Composition text is extracted from Analys section
- **WHEN** an `alphaspirit.se` product page is scraped and an `h3` with trimmed text `"Analys"` is present
- **THEN** the result SHALL contain the trimmed text of the `p` element immediately following that `h3` as the composition text

#### Scenario: Analys section is missing
- **WHEN** an `alphaspirit.se` product page is scraped and no `h3` with text `"Analys"` is found
- **THEN** the composition text SHALL be an empty string

### Requirement: Source registry dispatches Alpha Spirit URLs
The source registry SHALL route any URL containing `alphaspirit.se` to the Alpha Spirit scraper.

#### Scenario: Alpha Spirit URL is dispatched to Alpha Spirit scraper
- **WHEN** `findSource` is called with a URL containing `alphaspirit.se`
- **THEN** the returned entry SHALL use the `scrapeAlphaSpirit` function and have `brand` set to `"Alpha Spirit"`

### Requirement: Alpha Spirit source JSON defines product URL scaffold
The scraper SHALL have a source file at `scraper/sources/alphaspirit.json` with `scraper: alphaspirit`, `brand: Alpha Spirit`, `domain: alphaspirit.se`, a `discovery` block with `productLinkSelector` set to `.woocommerce.elementor-element .product .elementor-heading-title > a` and `listings` containing the dry, wet, and treats category URLs, and product lists for food types `dry`, `wet`, and `treats`.

#### Scenario: Alpha Spirit JSON is loaded without error
- **WHEN** `loadSource` is called with `alphaspirit.json` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

#### Scenario: Discovery listings include all category URLs
- **WHEN** `alphaspirit.json` is read
- **THEN** the `discovery.listings` array SHALL contain objects with `url` and `foodType` fields: the dry category URLs (`/produkt-kategori/foder/the-only-one/`, `/produkt-kategori/foder/soft-food/`, `/produkt-kategori/foder/primal-spirit/`) each with `foodType: "dry"`, the wet category URLs (`/produkt-kategori/foder/blotmat/` and `/produkt-kategori/foder/blotmat/page/2/`) each with `foodType: "wet"`, and the treats category URL (`/produkt-kategori/godis-tugg/`) with `foodType: "treats"`

### Requirement: Alpha Spirit selector reference documents HTML selectors
A file at `scraper/sources/alphaspirit.selectors.md` SHALL document the homepage URL, a representative HTML snippet, and the selectors used to extract title, ingredients description, and composition text from `alphaspirit.se` product pages.

#### Scenario: Selector reference exists for Alpha Spirit
- **WHEN** `scraper/sources/alphaspirit.selectors.md` is read
- **THEN** it SHALL contain the homepage URL, an HTML example, and a selectors table covering title, ingredients description (Sammansättning), and analytical constituents (Analys) extraction
