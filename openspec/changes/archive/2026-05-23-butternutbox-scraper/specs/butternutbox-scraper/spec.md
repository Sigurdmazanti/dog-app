## ADDED Requirements

### Requirement: Extract product title
The scraper SHALL extract the product title from a `[data-testid="title"]` element on the page.

#### Scenario: Title present in rendered HTML
- **WHEN** a butternutbox.com product page is fetched
- **THEN** the scraper returns a non-empty `title` string matching the `[data-testid="title"]` element text

### Requirement: Extract ingredients description from Ingredients accordion
The scraper SHALL extract the full text content of the "Ingredients" MUI Accordion section as the ingredients description.

#### Scenario: Ingredients accordion present
- **WHEN** the page contains an accordion button whose label text is "Ingredients"
- **THEN** the scraper returns the text content of the corresponding `[data-testid="rich-text"]` container as `ingredientsDescription`

#### Scenario: Ingredients accordion absent
- **WHEN** no accordion with the label "Ingredients" is found
- **THEN** the scraper returns an empty string for `ingredientsDescription`

### Requirement: Extract composition text from Nutritional info accordion
The scraper SHALL concatenate the ingredients description with the text content of the "Nutritional info" MUI Accordion section to produce the composition text.

#### Scenario: Nutritional info accordion present
- **WHEN** the page contains an accordion button whose label text is "Nutritional info"
- **THEN** the scraper returns a `compositionText` that includes both the ingredients description and the nutritional info text, joined by a newline

#### Scenario: Nutritional info accordion absent
- **WHEN** no "Nutritional info" accordion is found
- **THEN** the scraper returns only the ingredients description as the composition text

### Requirement: Domain registered in sourceRegistry
The scraper SHALL be registered in `sourceRegistry.ts` under the domain `butternutbox.com`.

#### Scenario: URL matches butternutbox domain
- **WHEN** a URL containing `butternutbox.com` is passed to `findSource()`
- **THEN** the registry returns the butternutbox source entry with brand `"Butternutbox"`

### Requirement: Source JSON catalogues all known products
The source JSON at `scraper/sources/butternutbox.json` SHALL list all provided product URLs under the correct food-type categories: `wet`, `treats`, and `misc`.

#### Scenario: All product categories present
- **WHEN** `butternutbox.json` is loaded
- **THEN** it contains non-empty arrays under `products.wet`, `products.treats`, and `products.misc`
