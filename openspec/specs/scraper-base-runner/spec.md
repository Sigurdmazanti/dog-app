### Requirement: Shared base runner executes the common scraper pipeline
The system SHALL provide a `runScraper(request, extractors)` function in `scraper/src/helpers/runScraper.ts` that accepts a `ScrapeRequest` and a `ScraperExtractors` object, and returns a `Promise<ScrapeResult>`. The function MUST handle: fetching the URL, loading HTML into cheerio, invoking the three extractor callbacks, calling `mapProductCompositionWithAI`, logging notes, type-casting all 8 composition sections, and returning the fully-populated `ScrapeResult`.

#### Scenario: Successful pipeline execution
- **WHEN** `runScraper` is called with a valid URL and extractor callbacks that return non-empty strings
- **THEN** the function SHALL return a `ScrapeResult` with `url`, `title`, `ingredientsDescription`, and all 8 typed composition section fields populated

#### Scenario: Empty composition text
- **WHEN** `extractCompositionText` returns an empty string
- **THEN** `runScraper` SHALL still call `mapProductCompositionWithAI` with the empty string and return whatever the mapper returns (no short-circuit)

#### Scenario: Mapping notes are logged
- **WHEN** `mapProductCompositionWithAI` returns a non-empty `notes` array
- **THEN** `runScraper` MUST log each note via `console.warn` with the `[composition-mapper]` prefix

### Requirement: ScraperExtractors interface defines the three extraction callbacks
The system SHALL export a `ScraperExtractors` TypeScript interface with three required properties: `extractTitle`, `extractIngredientsDescription`, and `extractCompositionText`. `extractCompositionText` MUST receive both the cheerio root `$` and the already-extracted `ingredientsDescription` string as parameters.

#### Scenario: All three extractors are called with the loaded cheerio instance
- **WHEN** `runScraper` loads the fetched HTML
- **THEN** it SHALL invoke all three extractor functions, passing the same `CheerioAPI` instance to each

#### Scenario: extractCompositionText receives ingredientsDescription
- **WHEN** `runScraper` calls `extractCompositionText`
- **THEN** the second argument SHALL be the string already returned by `extractIngredientsDescription`

### Requirement: All existing per-brand scrapers are refactored to use runScraper
Each file in `scraper/src/scrapers/` (acana-eu, advance, almo-nature, amanova, animonda, zooplus) SHALL be refactored so that its exported function delegates entirely to `runScraper`, supplying only a `ScraperExtractors` object. The duplicated fetch, AI-map, type-cast, and return blocks MUST be removed from each scraper file.

#### Scenario: Refactored scraper produces identical output
- **WHEN** a refactored scraper is called with the same `ScrapeRequest` as before
- **THEN** it SHALL return a `ScrapeResult` with the same fields and types as the pre-refactor version

#### Scenario: New scraper can be added with only extractor callbacks
- **WHEN** a developer adds a new brand scraper
- **THEN** the new file SHALL only need to define the three extractor functions and call `runScraper` — no axios, no cheerio load, no AI mapping, no type-cast boilerplate required
