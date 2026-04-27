## Why

The `--food-type` flag is redundant when scraping from YAML source files because each URL is already categorised under a food-type key (`products.dry`, `products.wet`, etc.). Currently the CLI requires the flag even in YAML batch mode, which means you can only scrape one food type per invocation and risk mismatches if the wrong type is specified. Removing this friction simplifies the most common workflow.

## What Changes

- `loadSourceUrls` returns `{ url, foodType }` pairs by iterating all food-type keys in the YAML instead of filtering by a single key.
- `batchScraper.runBatch` accepts URL+foodType pairs so each URL carries its own food type rather than receiving a single global type.
- `--food-type` becomes optional when using `--urls` with a YAML file — if omitted, all food types are scraped; if provided, it filters to that type only (preserving backward compatibility).
- Single-URL mode and non-YAML `--urls` mode keep `--food-type` (defaults to `dry`) since there is no YAML structure to infer from.

## Capabilities

### New Capabilities
- `food-type-from-yaml`: Automatic food-type inference from YAML source file structure, per-URL food-type pairing, and updated batch processing to use per-URL types.

### Modified Capabilities
- `batch-scraper-processing`: The YAML source file scenario changes — when no `--food-type` is given, all categories are loaded instead of requiring the flag. `runBatch` accepts per-URL food types.
- `scraper-cli-simplification`: The food-type default behaviour changes — when a YAML source file is used, the flag becomes optional and all types are scraped by default.

## Impact

- **Code**: `loadSourceUrls.ts`, `batchScraper.ts`, `scraper.ts` (CLI parsing + batch call site).
- **Interface**: `BatchOptions.foodType` changes from a single `FoodType` to per-URL. A new `UrlWithFoodType` interface is introduced.
- **Backward compatibility**: Existing `--food-type` flag still works as a filter — no **BREAKING** change. Non-YAML batch modes and single-URL mode are unaffected.
- **No native/build impact**: Scraper-only change, no EAS build required.
