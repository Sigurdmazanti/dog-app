## ADDED Requirements

### Requirement: Scrape Applaws product pages
The scraper SHALL extract a composed product title, ingredients description, and analytical constituents from product pages on `applaws.com` using Cheerio selectors targeting `.f-h5--filson`, `h1.c-detail__title`, and the Composition/Nutrition accordion panels.

#### Scenario: Title is composed from sub-brand line and variant name
- **WHEN** an `applaws.com` product page is scraped and both `.f-h5--filson` and `h1.c-detail__title` are present
- **THEN** the result SHALL contain a title formed by extracting the sub-brand/line text from `.f-h5--filson` (after stripping the `Applaws` brand prefix and pack-size quantity) concatenated with the variant name from `h1.c-detail__title`, separated by a single space

#### Scenario: Trademark symbol is removed from title
- **WHEN** the `.f-h5--filson` text contains a trademark symbol (™)
- **THEN** the composed title SHALL NOT contain that symbol

#### Scenario: Pack-size quantity is removed from title
- **WHEN** the `.f-h5--filson` text contains a bullet-separated quantity (e.g. `• 16 x 156g`)
- **THEN** the composed title SHALL NOT contain that quantity string

#### Scenario: Title falls back to h1 when f-h5--filson is absent
- **WHEN** an `applaws.com` product page is scraped and `.f-h5--filson` is not present
- **THEN** the result SHALL contain the text from `h1.c-detail__title` as the title, trimmed

#### Scenario: Ingredients description is extracted from the Composition accordion
- **WHEN** an `applaws.com` product page is scraped
- **THEN** the result SHALL contain the ingredients description taken from the `.f-body` element inside the `<article>` whose button text is `Composition`, trimmed

#### Scenario: Composition text is extracted from the Nutrition accordion
- **WHEN** an `applaws.com` product page is scraped
- **THEN** the result SHALL contain the analytical constituents text taken from the `.f-body` element inside the `<article>` whose button text is `Nutrition`, trimmed

### Requirement: Source registry dispatches Applaws URLs
The source registry SHALL route any URL containing `applaws.com` to the Applaws scraper.

#### Scenario: Applaws URL is dispatched to Applaws scraper
- **WHEN** `findSource` is called with a URL containing `applaws.com`
- **THEN** the returned entry SHALL use the `scrapeApplaws` function

### Requirement: Applaws source YAML defines product URLs by food type
The scraper SHALL have a source file at `scraper/sources/applaws.yaml` listing product URLs grouped by food type, using `scraper: applaws` and `domain: applaws.com`.

#### Scenario: Applaws YAML is loaded without error
- **WHEN** `loadSourceUrls` is called with `applaws.yaml` and a valid food type
- **THEN** it SHALL return the list of product URLs for that food type without error

### Requirement: Applaws selector reference documents HTML selectors
A file at `scraper/sources/applaws.selectors.md` SHALL document the homepage URL, a representative HTML snippet, and the selectors used to extract title, ingredients description, and analytical constituents from `applaws.com` product pages.

#### Scenario: Selector reference exists for Applaws
- **WHEN** `applaws.ts` is registered in `sourceRegistry.ts`
- **THEN** `scraper/sources/applaws.selectors.md` SHALL exist and contain a representative HTML snippet showing `.f-h5--filson`, `h1.c-detail__title`, and the accordion composition structure
