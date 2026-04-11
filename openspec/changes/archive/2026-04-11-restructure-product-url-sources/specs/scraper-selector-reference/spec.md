## ADDED Requirements

### Requirement: Per-brand selector reference file documents HTML selectors for scraper authoring
The system MUST provide a `scraper/sources/<scraper-id>.selectors.md` file for each registered brand scraper that documents the brand's homepage URL, a representative HTML snippet showing the selectors used to extract title, ingredients, and composition data, and any scraper-specific notes.

#### Scenario: Selector reference file exists for each registered scraper
- **WHEN** a scraper module is registered in `sourceRegistry.ts`
- **THEN** a corresponding `<scraper-id>.selectors.md` file SHALL exist in `scraper/sources/`

#### Scenario: Selector reference file contains HTML example
- **WHEN** a `.selectors.md` file is opened as Copilot context
- **THEN** it contains a representative HTML snippet from the brand's product page showing at minimum the title element, ingredients element, and analytical constituents element

#### Scenario: Selector reference file documents brand homepage
- **WHEN** a `.selectors.md` file is read
- **THEN** it includes the brand's homepage URL for reference

### Requirement: Monolithic sources.md is removed once per-brand selector files exist
The file `scraper/src/scraper-sources/sources.md` MUST be deleted after all per-brand `*.selectors.md` files have been created.

#### Scenario: sources.md is absent after migration
- **WHEN** the migration is complete and all per-brand selector files exist
- **THEN** `scraper/src/scraper-sources/sources.md` no longer exists in the repository
