## Why

Source files in `scraper/sources/` currently store a hand-curated list of product URLs grouped by food type as YAML. This is brittle on two axes: (1) when a brand adds, removes, or revises products, the file silently goes stale and the scraper keeps re-scraping an outdated catalogue, and (2) the file is YAML — which only made sense when humans were authoring those URL lists by hand. In practice the URL lists are not hand-edited, so the cost of YAML (lossy round-trip, comment-preservation gymnastics, hand-maintained `productCounts` that drift) is paid for no benefit.

We need an automated way to (a) **discover** the current set of product URLs for a source, (b) **group** them into food types without guesswork, and (c) **detect** when an already-known product's content has changed since the last scrape — and we should do this on top of a file format that is safe to machine-rewrite.

## What Changes

- **Migrate `scraper/sources/<brand>.yaml` to `scraper/sources/<brand>.json`** (one JSON file per brand) as a manual one-shot conversion performed during implementation: convert each file, delete the YAMLs, remove `js-yaml` from `scraper/package.json`. No migration script lives in the repo afterward.
- Drop the hand-maintained `productCounts` map. Counts are derived from `products` on read.
- Add a per-source **discovery step** that crawls the brand's category/listing pages and emits the current product URLs grouped by food type, derived from the listing-page context (so grouping comes from the brand's own taxonomy, not guessed).
- Add an **AI grouping fallback** for product URLs the discovery step cannot confidently classify. The fallback fetches the product page and asks OpenAI to classify it into the existing food-type vocabulary; ambiguous results are flagged for human review rather than silently committed.
- Add a **diff report** that compares freshly discovered URLs against `products` in the source JSON and reports added / removed / re-grouped URLs. Default behaviour prints the report; `--write` mutates the JSON file in place.
- Add **change detection** to the scraper run: each scraped product's key fields (title, composition text, analytical constituents, ingredients description) are hashed and stored under `scraper/.cache/<brand>.hashes.json`. Subsequent runs compare the hash and flag products whose content changed.
- Add new CLI commands in `scraper/`: `npm run discover -- --source <brand>` (run discovery + diff) and a `--detect-changes` flag on the existing scrape entry-points.
- Sweep all existing scraper documentation and per-brand specs (`scraper/README.md`, the `Creating a New Scraper` section in `.github/copilot-instructions.md`, every `scraper/sources/*.selectors.md`, every `openspec/specs/*-scraper/spec.md`) so they reference the new JSON format and drop `productCounts`. Delete the obsolete capability specs `openspec/specs/source-yaml-product-counts/` and `openspec/specs/bosch-product-url-list/` (both are entirely about the old YAML+productCounts contract).
- **BREAKING** (scraper subproject only): existing `loadSourceUrls(<file.yaml>)` switches to JSON. Any external command lines that pass `--urls path/to/<brand>.yaml` need to pass `.json` after migration. The mobile app is unaffected.

## Capabilities

### New Capabilities
- `scraper-source-format`: defines the per-brand JSON source file schema, including `discovery` config and machine-managed `products`, and replaces the existing YAML format.
- `scraper-product-discovery`: per-source crawler that walks category/listing pages and emits the current product URL set grouped by food type, with an AI classification fallback for ungrouped URLs.
- `scraper-source-diff`: compares discovered URLs against the source JSON and reports added / removed / re-grouped products, with an opt-in write-back to the JSON file.
- `scraper-product-change-detection`: hashes key fields per scraped product and flags products whose content changed since the previous run.

### Modified Capabilities
<!-- Two existing capability specs become obsolete and are deleted by this change rather than modified:
     - `source-yaml-product-counts`: contract was "productCounts must equal list lengths"; productCounts no longer exists.
     - `bosch-product-url-list`: spec is entirely about populating the YAML's productCounts; superseded by the new JSON format.
     The remaining `*-scraper` specs are mechanically updated (yaml -> json) but their requirements don't change in substance. -->

## Impact

- **Affected code**: `scraper/src/` only. Touches `scraper/src/helpers/utils/loadSourceUrls.ts` (switch from `js-yaml` to `JSON.parse`), `scraper/src/scraper.ts` (drop `--urls *.yaml` branch), `scraper/src/batchScraper.ts` (read JSON sources, wire change-detection summary). New modules under `scraper/src/discovery/`, `scraper/src/diff/`, and `scraper/src/changeDetection/`. New CLI entry-point `scraper/src/discovery.ts`. No changes to the React Native app.
- **Source files**: every existing `scraper/sources/<brand>.yaml` is converted to `scraper/sources/<brand>.json` once during implementation and the `.yaml` files are deleted. Co-located `<brand>.selectors.md` files are unaffected.
- **Dependencies**: removes `js-yaml` from `scraper/package.json`. No new runtime dependencies (reuses `axios`, `cheerio`, `openai`).
- **External systems**: additional outbound HTTP traffic to brand category pages; additional OpenAI calls only for the classification fallback (cost is bounded by the number of ungrouped URLs per run).
- **Storage**: per-product content hashes persist between runs as `scraper/.cache/<brand>.hashes.json` (gitignored).
- **Cross-platform / EAS**: not applicable — scraper is a Node CLI, not part of the mobile app. No new EAS build required.
- **Auth / Supabase**: no impact.
