## Why

The `scraper/src/helpers/` directory has grown to 13 files covering unrelated concerns — parsing, nutrition calculations, AI mapping, Google Sheets output, and general utilities — all dumped in one flat folder. This makes it hard to locate code, understand module boundaries, and onboard new contributors.

## What Changes

- Reorganise `scraper/src/helpers/` into logical subdirectories (`parsing/`, `nutrition/`, `composition/`, `output/`, `utils/`)
- Move each helper file to its appropriate subdirectory
- Update all import paths across `scraper/src/` to reflect the new locations
- No functional changes — behaviour is identical after the refactor

## Capabilities

### New Capabilities

- `scraper-helpers-structure`: Defines the subdirectory layout for `scraper/src/helpers/` — the canonical groupings, what belongs in each group, and the rules for where future helpers should be placed

### Modified Capabilities

<!-- No spec-level behaviour changes — this is a pure structural refactor -->

## Impact

- All files in `scraper/src/helpers/` are moved; existing imports in `scraper.ts`, `batchScraper.ts`, `sourceRegistry.ts`, and individual scrapers under `scrapers/` will need updating
- No changes to `scraper/interfaces/` or `scraper/scrapers/` themselves
- No dependency additions or removals
- No effect on the app/ or openspec/ packages
