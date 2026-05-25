## ADDED Requirements

### Requirement: Scrape Essential Foods product pages
The scraper SHALL extract product title, ingredients description, and composition text from product pages on `essentialfoods.com`. Product data is rendered inside collapsible `<details class="accordion">` elements that are fully present in the server-rendered HTML. The title SHALL be taken from `h1.heading-size-6.product__title span[data-zoom-caption]`. The ingredients description SHALL be the text of the `<p>` element inside the "THE RECIPE" accordion's `.accordion__content .metafield-rich_text_field`. The composition text SHALL join the nutritional values list (each item formatted as `"<description>: <percentage>"`) and the additives free-text block from the "ADDITIVES PER KG" accordion, separated by `\n`, filtering empty values.

#### Scenario: Title is extracted from the product page
- **WHEN** an `essentialfoods.com` product page is scraped
- **THEN** the scraper SHALL return the text of `h1.heading-size-6.product__title span[data-zoom-caption]` as the product title, with leading/trailing whitespace trimmed

#### Scenario: Ingredients description is extracted from THE RECIPE accordion
- **WHEN** the product page contains a `<details class="accordion">` whose `<summary class="accordion__title">` text contains "THE RECIPE"
- **THEN** the scraper SHALL return the trimmed text of the `<p>` inside `.accordion__content .metafield-rich_text_field` as the ingredients description

#### Scenario: THE RECIPE accordion is absent
- **WHEN** the product page has no accordion with "THE RECIPE" in its summary
- **THEN** `extractIngredientsDescription` SHALL return an empty string and SHALL NOT throw

#### Scenario: Nutritional values are present in the NUTRITIONAL VALUES accordion
- **WHEN** the product page contains a `<details class="accordion">` whose summary contains "NUTRITIONAL VALUES" and the body contains `<ul class="nutritional-values">`
- **THEN** each `<li>` in the list SHALL be serialised as `"<nutritional-description>: <nutritional-percentage>"` (trimmed), and all items SHALL be joined with `\n` as part of the composition text

#### Scenario: Additives are present in the ADDITIVES PER KG accordion
- **WHEN** the product page contains a `<details class="accordion">` whose summary contains "ADDITIVES PER KG"
- **THEN** the trimmed text of `.accordion__content .metafield-rich_text_field` SHALL be appended to the composition text, separated from the nutritional values block by `\n`

#### Scenario: One or more composition accordions are absent
- **WHEN** the product page is missing either "NUTRITIONAL VALUES" or "ADDITIVES PER KG" accordions
- **THEN** the absent sections SHALL contribute an empty string, and only non-empty sections SHALL appear in the composition text

### Requirement: Source registry dispatches Essential Foods URLs
The source registry SHALL route any URL containing `essentialfoods.com` to the Essential Foods scraper.

#### Scenario: Essential Foods URL is dispatched to the correct scraper
- **WHEN** `findSource` is called with a URL containing `essentialfoods.com`
- **THEN** the returned entry SHALL use the `scrapeEssentialFoods` function and have `brand` set to `"Essential Foods"`

### Requirement: Essential Foods source JSON defines product groups and discovery config
The scraper SHALL have a source file at `scraper/sources/essentialfoods.json` with `scraper: essentialfoods`, `brand: Essential Foods`, `domain: essentialfoods.com`, a `discovery` block with `productLinkSelector` set to `.collection-products > .collection__products .product-item-card .product-item__image > .product-link` and `listings` covering all food type categories. Product arrays SHALL initially be empty (to be populated manually). Bundle packs, taste boxes, and accessory URLs SHALL be listed in `needsReview`.

#### Scenario: Source JSON is loaded without error
- **WHEN** `loadSource` is called with `essentialfoods.json` and a valid food type
- **THEN** it SHALL return the list of product URLs (or an empty array if not yet populated) without error

#### Scenario: Discovery listings cover all food type categories
- **WHEN** `essentialfoods.json` is read
- **THEN** the `discovery.listings` array SHALL contain objects with `url` and `foodType` covering:
  - `https://essentialfoods.com/collections/dog-meals` → `foodType: "dry"`
  - `https://essentialfoods.com/collections/sample-meals` → `foodType: "dry"`
  - `https://essentialfoods.com/collections/pates` → `foodType: "wet"`
  - `https://essentialfoods.com/collections/treats` → `foodType: "treats"`
  - `https://essentialfoods.com/collections/daily-supplements` → `foodType: "misc"`

#### Scenario: Excluded bundle and accessory URLs are in needsReview
- **WHEN** `essentialfoods.json` is read
- **THEN** the `needsReview` array SHALL contain all bundle, taste-box, and accessory URLs provided at design time (e.g. licking mat, pate taste boxes, mixed meals boxes, oil bundles, explorer boxes, finest box, training box, delight box)
