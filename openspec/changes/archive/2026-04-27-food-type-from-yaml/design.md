## Context

The scraper CLI currently requires `--food-type` for every invocation. When using YAML source files (`--urls brand.yaml`), this is redundant — the YAML already organises URLs by food type under `products.dry`, `products.wet`, etc. The current `loadSourceUrls()` function takes a single `foodType` argument and returns only URLs from that one key. The batch scraper then applies that same food type globally to every URL.

This forces users to run multiple commands to scrape all food types for a brand (once per type), and introduces the risk of specifying the wrong type for a URL.

## Goals / Non-Goals

**Goals:**
- Eliminate the need for `--food-type` when scraping from YAML source files
- Let each URL carry its own food type through the batch pipeline so nutrition calculations (water defaults, NFE) use the correct type per product
- Preserve full backward compatibility — existing commands with `--food-type` keep working

**Non-Goals:**
- Changing single-URL mode (no YAML to infer from — `--food-type` stays, defaults to `dry`)
- Changing non-YAML `--urls` mode (plain text / markdown lists have no food-type structure)
- Modifying the YAML source file schema
- Changing how `scrapeUrl()` uses `foodType` internally

## Decisions

### 1. Introduce a `UrlWithFoodType` interface

A new `{ url: string; foodType: FoodType }` interface pairs each URL with its food type. This is the data type that flows through the batch pipeline.

**Rationale**: Keeps the pairing explicit and type-safe. The alternative — a `Map<FoodType, string[]>` — would require restructuring the entire batch flow. A flat array of pairs slots into the existing `runBatch` loop with minimal change.

### 2. `loadSourceUrls` gains an overload with optional `foodType`

When `foodType` is provided, it returns only URLs from that key (current behaviour). When omitted, it iterates all keys in `products` and returns `UrlWithFoodType[]` pairs.

**Rationale**: A single function with an optional parameter keeps the API surface small. The alternative — a new function — would leave the old one around with no clear deprecation path.

### 3. `runBatch` accepts `UrlWithFoodType[]` instead of `string[]` + global `foodType`

Each URL in the batch carries its own food type. The `BatchOptions.foodType` field is removed; callers build the paired array before calling `runBatch`.

**Rationale**: This is the minimal structural change. The caller (CLI `main()`) is responsible for pairing — either from YAML inference or from the `--food-type` flag value applied to all URLs.

### 4. CLI `--food-type` becomes a filter for YAML mode, stays as-is for other modes

- **YAML `--urls`**: If `--food-type` given → filter to that type. If omitted → scrape all types.
- **Non-YAML `--urls` / `--sitemap` / single-URL**: `--food-type` still required (defaults to `dry`).

**Rationale**: This is backward compatible. Every existing command produces the same result. The only new behaviour is omitting the flag with YAML files.

## Risks / Trade-offs

- **Larger batches by default** → When `--food-type` is omitted with a YAML file, all product URLs across all types are scraped at once. This could be a longer run than expected.
  → Mitigation: Log the count per food type at the start of the batch so the user sees what's happening.

- **Interface change in `runBatch`** → Any code calling `runBatch` directly must be updated.
  → Mitigation: There is only one call site (in `scraper.ts` `main()`). Low risk.
