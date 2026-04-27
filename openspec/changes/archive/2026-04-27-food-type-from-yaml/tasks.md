## 1. UrlWithFoodType interface and loadSourceUrls

- [x] 1.1 Create `UrlWithFoodType` interface (`{ url: string; foodType: FoodType }`) in `scraper/src/interfaces/`
- [x] 1.2 Update `loadSourceUrls` to support optional `foodType` parameter — when omitted, iterate all `products` keys and return `UrlWithFoodType[]`; when provided, return only URLs for that key paired with the food type
- [x] 1.3 Verify `loadSourceUrls` with a test YAML: `npx ts-node src/scraper.ts --urls sources/acana-eu.yaml --no-sheets`

## 2. Batch scraper per-URL food type

- [x] 2.1 Update `BatchOptions` to remove the global `foodType` field
- [x] 2.2 Update `runBatch` to accept `UrlWithFoodType[]` instead of `string[]` and use each entry's `foodType` in the `scrapeUrl` call
- [x] 2.3 Verify batch still compiles: `npx tsc --noEmit`

## 3. CLI argument handling

- [x] 3.1 Update YAML `--urls` path in `main()` to call `loadSourceUrls` without `foodType` when flag is omitted, producing `UrlWithFoodType[]`
- [x] 3.2 Update YAML `--urls` path to call `loadSourceUrls` with `foodType` filter when `--food-type` is explicitly provided
- [x] 3.3 Update non-YAML `--urls` and `--sitemap` paths to pair each URL with the `--food-type` value (defaulting to `dry`) before calling `runBatch`
- [x] 3.4 Update single-URL mode — keep existing `--food-type` default to `dry` behaviour unchanged
- [x] 3.5 Update CLI usage text to reflect that `--food-type` is optional for YAML source files
- [x] 3.6 Verify end-to-end: `npx ts-node src/scraper.ts --urls sources/acana-eu.yaml --no-sheets` (scrapes all food types without `--food-type`)
