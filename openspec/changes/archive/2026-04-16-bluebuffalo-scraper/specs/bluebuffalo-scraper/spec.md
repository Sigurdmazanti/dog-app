## ADDED Requirements

### Requirement: Scrape Blue Buffalo product pages
The scraper SHALL extract a composed product title, ingredients description, and guaranteed analysis text from product pages on `bluebuffalo.com` using Cheerio selectors targeting `h1`, `h3[itemprop=name]`, and `[role=tabpanel]` panels located via `[role=tab]` button `aria-controls` attributes.

#### Scenario: Title is composed from sub-brand h1 and variant h3
- **WHEN** a `bluebuffalo.com` product page is scraped and both `h1` and `h3[itemprop=name]` are present
- **THEN** the result SHALL contain a title formed by concatenating the cleaned `h1` text with the `h3[itemprop=name]` text, separated by a single space

#### Scenario: Trademark symbol is removed from the h1 sub-brand text
- **WHEN** the `h1` text contains a trademark or registered symbol (`™` or `®`)
- **THEN** the composed title SHALL NOT contain that symbol

#### Scenario: Title falls back to h3 when h1 is absent
- **WHEN** a `bluebuffalo.com` product page is scraped and `h1` is not present
- **THEN** the result SHALL contain only the `h3[itemprop=name]` text as the title, trimmed

#### Scenario: Ingredients are extracted from the Ingredients tabpanel
- **WHEN** a `bluebuffalo.com` product page is scraped
- **THEN** the result SHALL contain an ingredients description formed by joining all ingredient names — read from `data-tag-text` on anchor tags and text content from span elements within the Ingredients tabpanel — in DOM order, comma-separated

#### Scenario: Ingredients tabpanel is located via the tab button aria-controls attribute
- **WHEN** the Ingredients `[role=tab]` button is found and its `aria-controls` attribute is read
- **THEN** the scraper SHALL select the tabpanel by that ID, not by positional index

#### Scenario: Guaranteed analysis is extracted from the Guaranteed Analysis tabpanel
- **WHEN** a `bluebuffalo.com` product page is scraped
- **THEN** the result SHALL contain the analytical constituents text formed by joining each table row in the Guaranteed Analysis tabpanel as `Name: Value` lines, newline-separated

#### Scenario: Guaranteed Analysis tabpanel is located via the tab button aria-controls attribute
- **WHEN** the Guaranteed Analysis `[role=tab]` button is found and its `aria-controls` attribute is read
- **THEN** the scraper SHALL select the tabpanel by that ID, not by positional index

### Requirement: Source registry dispatches Blue Buffalo URLs
The source registry SHALL route any URL containing `bluebuffalo.com` to the Blue Buffalo scraper.

#### Scenario: Blue Buffalo URL is dispatched to Blue Buffalo scraper
- **WHEN** `findSource` is called with a URL containing `bluebuffalo.com`
- **THEN** the returned entry SHALL use the `scrapeBluebuffalo` function

### Requirement: Blue Buffalo source YAML defines product URLs by food type
The scraper SHALL have a source file at `scraper/sources/bluebuffalo.yaml` listing product URLs grouped by food type, using `scraper: bluebuffalo` and `domain: bluebuffalo.com`.

#### Scenario: Blue Buffalo YAML is loaded without error
- **WHEN** `loadSourceUrls` is called with `bluebuffalo.yaml` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

### Requirement: Blue Buffalo selector reference documents HTML selectors
A file at `scraper/sources/bluebuffalo.selectors.md` SHALL document the homepage URL, a representative HTML snippet, and the selectors used to extract title, ingredients description, and guaranteed analysis from `bluebuffalo.com` product pages.

#### Scenario: Selector reference exists for Blue Buffalo
- **WHEN** `bluebuffalo.ts` is registered in `sourceRegistry.ts`
- **THEN** `scraper/sources/bluebuffalo.selectors.md` SHALL exist and contain a representative HTML snippet showing `h1`, `h3[itemprop=name]`, the `[role=tablist]` tab structure, and the tabpanel ingredient and analysis content
