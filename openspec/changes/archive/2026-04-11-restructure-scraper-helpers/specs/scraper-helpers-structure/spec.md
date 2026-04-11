## ADDED Requirements

### Requirement: Helpers are organised into domain subdirectories
The `scraper/src/helpers/` directory SHALL be structured into named subdirectories that group files by their domain concern. No helper file SHALL sit directly inside `helpers/` except `runScraper.ts`, which acts as the top-level orchestration entry point.

The canonical subdirectory layout SHALL be:

| Directory | Purpose | Files |
|---|---|---|
| `parsing/` | Textual and data-format parsing | `sitemapParser.ts`, `urlListParser.ts`, `percentageStringToInt.ts` |
| `nutrition/` | Nutrition domain calculations and mappings | `nutritionCalculator.ts`, `waterAmountMapper.ts` |
| `composition/` | Product composition processing | `aiProductCompositionMapper.ts`, `productCompositionKeyMap.ts` |
| `output/` | External output integrations | `googleSheetsAppender.ts` |
| `utils/` | General cross-cutting utilities | `logger.ts`, `matchesAlias.ts`, `loadSourceUrls.ts`, `checkMissingFields.ts` |

#### Scenario: Parsing helpers are in the parsing subdirectory
- **WHEN** a developer navigates to `scraper/src/helpers/`
- **THEN** `sitemapParser.ts`, `urlListParser.ts`, and `percentageStringToInt.ts` SHALL exist under `helpers/parsing/` and NOT in the `helpers/` root

#### Scenario: Nutrition helpers are in the nutrition subdirectory
- **WHEN** a developer navigates to `scraper/src/helpers/`
- **THEN** `nutritionCalculator.ts` and `waterAmountMapper.ts` SHALL exist under `helpers/nutrition/` and NOT in the `helpers/` root

#### Scenario: Composition helpers are in the composition subdirectory
- **WHEN** a developer navigates to `scraper/src/helpers/`
- **THEN** `aiProductCompositionMapper.ts` and `productCompositionKeyMap.ts` SHALL exist under `helpers/composition/` and NOT in the `helpers/` root

#### Scenario: Output helpers are in the output subdirectory
- **WHEN** a developer navigates to `scraper/src/helpers/`
- **THEN** `googleSheetsAppender.ts` SHALL exist under `helpers/output/` and NOT in the `helpers/` root

#### Scenario: General utilities are in the utils subdirectory
- **WHEN** a developer navigates to `scraper/src/helpers/`
- **THEN** `logger.ts`, `matchesAlias.ts`, `loadSourceUrls.ts`, and `checkMissingFields.ts` SHALL exist under `helpers/utils/` and NOT in the `helpers/` root

#### Scenario: runScraper remains at the helpers root
- **WHEN** a developer navigates to `scraper/src/helpers/`
- **THEN** `runScraper.ts` SHALL exist directly at `helpers/runScraper.ts` (not inside any subdirectory)

### Requirement: All import paths are updated to match the new locations
Every file in `scraper/src/` that imports from `helpers/` SHALL reference the file's new subdirectory path. No import SHALL reference an old flat `helpers/<file>` path that no longer exists.

#### Scenario: TypeScript compiler reports zero errors after the move
- **WHEN** `tsc --noEmit` is run from the `scraper/` directory after the restructure
- **THEN** the compiler SHALL report zero errors related to missing modules or unresolved imports

#### Scenario: scraper.ts imports resolve correctly
- **WHEN** `scraper/src/scraper.ts` is compiled
- **THEN** all its `helpers/` imports SHALL point to valid file paths under the new subdirectory structure

#### Scenario: batchScraper.ts imports resolve correctly
- **WHEN** `scraper/src/batchScraper.ts` is compiled
- **THEN** all its `helpers/` imports SHALL point to valid file paths under the new subdirectory structure
