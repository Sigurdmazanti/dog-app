<!-- Note: All tasks below live in the `scraper/` Node CLI subproject, which uses npm
     (per .github/copilot-instructions.md). The yarn-only project rule applies to the
     React Native app, not the scraper.

     Implementation phases:
       Phase A (groups 1–4): flip the source format from YAML to JSON, update every consumer
         and every doc/spec in lock-step so the repo is internally consistent at every commit.
         No new features yet; existing scrape commands keep working against the new JSON files.
       Phase B (groups 5–8): build discovery + AI fallback + diff + write-back.
       Phase C (groups 9–11): build change detection and wire it into the batch scraper.
-->

## 1. Source format types & loader (`scraper/src/`)

- [x] 1.1 Define `Source`, `DiscoveryConfig`, `DiscoveryListing`, `NeedsReviewEntry` interfaces in `scraper/src/interfaces/source.ts`; deprecate the existing YAML-shaped interface
- [x] 1.2 Implement `scraper/src/helpers/utils/loadSource.ts` exporting `loadSource(brand: string): Source` that reads `scraper/sources/<brand>.json`, validates required fields (`scraper`, `brand`, `domain`, `products`), validates absolute URLs, and ignores any legacy `productCounts` key
- [x] 1.3 Add a `getProductCount(source, foodType?)` helper that derives counts from `products` on call
- [x] 1.4 Verification: hand-write one valid and one intentionally-malformed source JSON in a tmp dir; confirm the loader accepts the first and produces a useful error for the second

## 2. One-shot YAML→JSON conversion (manual, no committed script)

- [x] 2.1 For every `scraper/sources/*.yaml`: read it, build the new JSON shape (drop `productCounts`, add `discovery: { listings: [], productLinkSelector: "" }`, add `needsReview: []`), assert `Object.values(json.products).flat().length === yaml.productCounts.total`, write `<brand>.json`, delete the YAML
- [x] 2.2 Remove `js-yaml` and `@types/js-yaml` from `scraper/package.json`; run `npm install` to refresh `package-lock.json`
- [x] 2.3 Verification: `Get-ChildItem scraper/sources -Filter *.yaml` returns nothing; `grep -r "js-yaml" scraper/` returns nothing

## 3. Update existing YAML consumers (`scraper/src/`)

- [x] 3.1 Replace `scraper/src/helpers/utils/loadSourceUrls.ts` with a JSON-only implementation: read `<file.json>`, validate, emit `UrlWithFoodType[]` exactly as the YAML version did
- [x] 3.2 Update `scraper/src/scraper.ts`: drop the `isYaml` branch from the `--urls` handling; if the path ends in `.yaml`/`.yml`, exit with a one-line migration hint; update the usage string in the help text
- [x] 3.3 Update `scraper/src/batchScraper.ts` to load via `loadSource()` and iterate `source.products`
- [x] 3.4 Verification: `grep -r "js-yaml\|\.yaml" scraper/src/` returns zero matches; `npx ts-node src/scraper.ts --urls scraper/sources/canex.json` scrapes a migrated source end-to-end

## 4. Documentation & spec sweep (in lock-step with the format flip)

- [x] 4.1 Rewrite the source-format parts of `scraper/README.md`: describe the new JSON source format, drop YAML and `productCounts` references. (Discovery + change-detection sections are added later, in groups 8 and 11.)
- [x] 4.2 Update `.github/copilot-instructions.md` “Creating a New Scraper” section: replace the YAML template with the JSON template (no `productCounts`, includes an empty `discovery` block). Update example commands to use `<brand>.json`.
- [x] 4.3 Sweep `scraper/sources/*.selectors.md`: every reference to `<brand>.yaml` becomes `<brand>.json`. Mechanical pass across that file set only.
- [x] 4.4 Sweep `openspec/specs/*-scraper/spec.md` (~40 files): replace `<brand>.yaml` with `<brand>.json`, drop any `productCounts` requirements/scenarios, update `loadSourceUrls` references to `loadSource`. Single bulk edit pass.
- [x] 4.5 Delete the obsolete capability specs `openspec/specs/source-yaml-product-counts/` and `openspec/specs/bosch-product-url-list/` (both are entirely about the old YAML+`productCounts` contract). Mention these deletions in the change’s archive notes when archiving.
- [x] 4.6 Verification: a workspace-wide search for `\.yaml` and `productCounts` (excluding `openspec/changes/archive/**`, `**/dist/**`, `node_modules/**`, and `.openspec.yaml` schema files) returns zero hits in scraper-related paths

## 5. Discovery types & config (`scraper/src/discovery/`)

- [x] 5.1 Create `scraper/src/discovery/types.ts` with `DiscoveryResult`, `DiscoveredUrl` (`{ url, foodType, source: 'listing' | 'ai' | 'needs-review', confidence?, reason? }`)
- [x] 5.2 Add `loadDiscoveryConfig(brand): DiscoveryConfig` that reads via `loadSource()` and throws when `discovery.listings` is empty or `productLinkSelector` is missing
- [x] 5.3 Verification: write a Canex `discovery` block by hand in `scraper/sources/canex.json` and assert `loadDiscoveryConfig('canex')` parses it; assert it throws for a brand with an empty discovery block

## 6. Listing crawler (`scraper/src/discovery/crawlListing.ts`)

- [x] 6.1 Implement `crawlListing(listing, opts)` — axios fetch with descriptive `User-Agent`, cheerio parse, return absolute hrefs matching `productLinkSelector`
- [x] 6.2 Add pagination: when `pagination.nextSelector` is set, follow next-page links sequentially up to `pagination.maxPages` (default 20), deduping URLs across pages, warning when the cap is hit
- [x] 6.3 Add a configurable polite delay (default 500ms) between fetches via a `sleep` helper
- [ ] 6.4 Verification: run the crawler against one Canex category page and confirm it returns the same URLs currently in `products.dry`

## 7. AI fallback classifier (`scraper/src/discovery/classifyFoodType.ts`)

- [x] 7.1 Implement `classifyFoodType(url, opts)` — fetch product page, extract title/breadcrumbs/lead paragraph, send to OpenAI with the fixed food-type vocabulary as the allowed labels, parse `{ foodType, confidence }`
- [x] 7.2 Apply confidence threshold (default `0.8`); below threshold returns `{ source: 'needs-review', bestGuess, confidence }`
- [x] 7.3 Catch fetch and OpenAI errors and return `{ source: 'needs-review', reason }` so a single failure cannot abort discovery
- [x] 7.4 Skip URLs already present in the source's `needsReview` array (carry them forward verbatim)
- [ ] 7.5 Verification: classify one known-dry URL (expect confident `dry`) and one deliberately-ambiguous URL (expect `needs-review`)

## 8. Discovery orchestrator (`scraper/src/discovery/runDiscovery.ts`)

- [x] 8.1 Implement `runDiscovery(brand): Promise<DiscoveryResult>` — load source, run `crawlListing` for each listing, attach the listing's `foodType`, dedupe across listings
- [x] 8.2 For URLs in the source's `products` map but not produced by any listing, run `classifyFoodType` to recover their grouping
- [x] 8.3 Carry forward existing `needsReview` entries from the source unchanged
- [ ] 8.4 Verification: run end-to-end against `canex` and assert every URL gets a confident `foodType` or lands in `needsReview`

## 9. Diff engine (`scraper/src/diff/`)

- [x] 9.1 Create `scraper/src/diff/buildDiff.ts` exporting `buildDiff(sourceProducts, discoveryResult): DiffReport` with `added`, `removed`, `regrouped`, `needsReview` per the `scraper-source-diff` spec
- [x] 9.2 Implement the 50% safety guard as a pure function `evaluateGuard(sourceProducts, discoveryResult): { tripped, details }`
- [x] 9.3 Add a console renderer `renderDiff(report): string` matching the format in `design.md`
- [x] 9.4 Verification: feed `buildDiff` synthetic source + discovery inputs covering each bucket; assert the rendered output matches expectations

## 10. JSON write-back (`scraper/src/diff/writeSource.ts`)

- [x] 10.1 Implement `applyDiffToSource(brand, report): void` — load via `loadSource()`, apply `added`/`removed`/`regrouped` to `products`, replace `needsReview` with the current run's bucket, write back via `JSON.stringify(obj, null, 2) + '\n'`
- [x] 10.2 Make the write atomic: write to a sibling tmp file then rename, so a failed write never leaves a corrupt source on disk
- [x] 10.3 Round-trip verification: `loadSource('canex')` → immediately re-write with no diff applied → assert the file is byte-identical
- [x] 10.4 Diff-write verification: against a temp copy of `canex.json`, apply a synthetic diff with one add, one remove, one regroup, one needs-review entry; assert each bucket lands in the expected place and `products` does NOT contain the needs-review URL

## 11. Discovery CLI entry-point (`scraper/src/discovery.ts`)

- [x] 11.1 Create `scraper/src/discovery.ts` parsing `--source <brand>`, `--write`, `--force`, `--confidence-threshold <n>`
- [x] 11.2 Wire `runDiscovery` → `buildDiff` → `renderDiff` → optional `applyDiffToSource` (gated on `evaluateGuard` unless `--force`)
- [x] 11.3 Add `discover` script to `scraper/package.json` so `npm run discover -- --source canex` works
- [ ] 11.4 Add a worked-example `discovery` block to `scraper/sources/canex.json` so other brands have a copy-paste reference
- [x] 11.5 Add a `## Discovery` section to `scraper/README.md` documenting the `discovery` block schema, `npm run discover` (`--write` / `--force` / `--confidence-threshold`), the four diff buckets, and the 50% safety guard
- [ ] 11.6 Verification: `npm run discover -- --source canex` (no `--write`) prints a sensible diff and leaves `canex.json` untouched

## 12. Change detection — hashing (`scraper/src/changeDetection/hashProduct.ts`)

- [x] 12.1 Implement `normaliseHashField(value: string): string` — trim, collapse internal whitespace, normalise line endings
- [x] 12.2 Implement `hashProduct(product): string` — SHA-256 over the canonical concatenation of normalised title, composition text, analytical constituents, and ingredients description
- [x] 12.3 Verification: hash the same product twice with cosmetic whitespace differences (assert equal); mutate one field (assert different)

## 13. Change detection — cache & summary (`scraper/src/changeDetection/`)

- [x] 13.1 Add `scraper/.cache/` to the scraper's `.gitignore` (create the file if missing)
- [x] 13.2 Implement `loadHashCache(brand)` and `saveHashCache(brand, cache)` for `scraper/.cache/<brand>.hashes.json`, treating a missing file as empty
- [x] 13.3 Implement `buildChangeSummary(previous, currentRunProducts): ChangeSummary` classifying every URL as `new | changed | unchanged | removed`, including previous/current hash on `changed`
- [x] 13.4 Add a console renderer for the change summary

## 14. Wire change detection into batch scraper + final docs (`scraper/src/batchScraper.ts`, `scraper/README.md`)

- [x] 14.1 Add a `--detect-changes` flag (default `true` for `--source` runs, ignored otherwise)
- [x] 14.2 After the existing batch scrape completes successfully, load the prior cache, build the change summary, render it, persist the new cache
- [x] 14.3 Skip 14.2 entirely when `--detect-changes=false`
- [x] 14.4 Add a `## Change detection` section to `scraper/README.md` documenting the cache location, the four classifications (`new` / `changed` / `unchanged` / `removed`), and the `--detect-changes` flag
- [ ] 14.5 Verification: run `npx ts-node src/batchScraper.ts --source canex` twice; first run reports every product as `new`, second run reports them as `unchanged`
