## 1. Dependencies and Types

- [x] 1.1 Add `js-yaml` (or `yaml`) to `scraper/package.json` dependencies and install
- [x] 1.2 Add `Treats = "treats"` and `FreezeDried = "freeze-dried"` to `src/interfaces/foodTypes.ts`
- [x] 1.3 Verify the CLI accepts `--food-type treats` and `--food-type freeze-dried` without crashing

## 2. YAML Source Loader

- [x] 2.1 Create `src/helpers/loadSourceUrls.ts` — `loadSourceUrls(yamlPath: string, foodType: FoodType): string[]` that parses a brand YAML source file and returns URLs for the given food type, defaulting missing keys to `[]`
- [x] 2.2 Update `src/scraper.ts` CLI `--urls` handling: if the path ends in `.yaml` or `.yml`, call `loadSourceUrls(path, foodType)` instead of `parseUrlListFile(path)`

## 3. Brand YAML Source Files

- [x] 3.1 Create `scraper/sources/acana-eu.yaml` with dry URLs from `scrape-dry.md` (emea.acana.com entries)
- [x] 3.2 Create `scraper/sources/acana-us.yaml` with dry, wet, treats, and freeze-dried URLs from all four markdown files (www.acana.com entries)
- [x] 3.3 Create `scraper/sources/advance.yaml` with dry and wet URLs (advancepet.com.au entries)
- [x] 3.4 Create `scraper/sources/almo-nature.yaml` with dry, wet, and treats URLs (almonature.com entries)
- [x] 3.5 Create `scraper/sources/amanova.yaml` with empty product lists as a placeholder (no amanova URLs existed in source files)
- [x] 3.6 Create `scraper/sources/animonda.yaml` with dry, wet, and treats URLs (animonda.de entries, duplicates removed)
- [x] 3.7 Create `scraper/sources/zooplus.yaml` with empty product lists as a placeholder
- [x] 3.8 Verify total URL count across all YAML files matches the total in the four markdown files

## 4. Brand Selector Reference Files

- [x] 4.1 Create `scraper/sources/acana-eu.selectors.md` with homepage URL and representative HTML selectors from `sources.md`
- [x] 4.2 Create `scraper/sources/acana-us.selectors.md`
- [x] 4.3 Create `scraper/sources/advance.selectors.md`
- [x] 4.4 Create `scraper/sources/almo-nature.selectors.md`
- [x] 4.5 Create `scraper/sources/amanova.selectors.md`
- [x] 4.6 Create `scraper/sources/animonda.selectors.md`
- [x] 4.7 Create `scraper/sources/zooplus.selectors.md`

## 5. Smoke Test and Cleanup

- [x] 5.1 Smoke-test: `npx ts-node src/scraper.ts --urls ../sources/acana-eu.yaml --food-type dry --no-sheets` against the first Acana EU URL
- [x] 5.2 Delete `scraper/scrape-dry.md`, `scraper/scrape-wet.md`, `scraper/scrape-treats.md`, `scraper/scrape-freeze-dried.md`
- [x] 5.3 Delete `scraper/src/scraper-sources/sources.md` (and the now-empty `scraper-sources/` directory if nothing else remains)
