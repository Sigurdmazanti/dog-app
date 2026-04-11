## Why

The scraper's product URL lists are split across four flat markdown files (`scrape-dry.md`, `scrape-wet.md`, `scrape-freeze-dried.md`, `scrape-treats.md`) with no structure beyond blank-line brand groupings, and `scraper-sources/sources.md` mixes brand metadata, raw HTML scraping examples, and Copilot context hints into a single unwieldy document. As the number of brands and food types grows, the format makes it hard to know which brands are supported, which products are missing, and how to add new ones correctly.

## What Changes

- Replace the four food-type URL list files with per-brand YAML source files under `scraper/sources/<scraper-id>.yaml`, each containing typed URL lists (`dry`, `wet`, `treats`, `freeze-dried`) grouped by food type
- Replace `scraper-sources/sources.md` with a structured per-brand selector reference format — split into individual `scraper/sources/<scraper-id>.selectors.md` files — so Copilot has focused, per-brand context when generating or editing scrapers
- Update the batch scraper and CLI to load product URLs from the new YAML source files instead of the flat `.md` files

## Capabilities

### New Capabilities
- `scraper-source-registry`: Per-brand YAML source files that define product URLs by food type, replacing the four flat markdown list files. Each file maps to a scraper by ID and contains typed URL lists.
- `scraper-selector-reference`: Per-brand selector reference files (`*.selectors.md`) that replace the monolithic `sources.md`, providing focused HTML selector examples used as Copilot context when writing new scrapers.

### Modified Capabilities
- `multi-source-scraping`: The URL loading mechanism changes — product URLs will now be loaded from YAML source files keyed by scraper ID rather than read from flat markdown files.
- `batch-scraper-processing`: The batch processor must be updated to read URLs from the new YAML source files.
- `scraper-cli-simplification`: The CLI entry point that reads the markdown URL lists must be updated to read from the new YAML sources.

## Impact

- `scraper/scrape-dry.md`, `scrape-wet.md`, `scrape-freeze-dried.md`, `scrape-treats.md` — deleted
- `scraper/src/scraper-sources/sources.md` — replaced by per-brand `*.selectors.md` files
- New `scraper/sources/` directory with `<scraper-id>.yaml` and `<scraper-id>.selectors.md` per brand
- `scraper/src/batchScraper.ts` and CLI entry points updated to load from YAML
- No Supabase schema changes, no mobile app changes, no EAS build required
