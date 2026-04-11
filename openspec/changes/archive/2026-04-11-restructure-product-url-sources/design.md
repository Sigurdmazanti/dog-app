## Context

The scraper currently reads product URLs from four flat markdown files (`scrape-dry.md`, `scrape-wet.md`, `scrape-freeze-dried.md`, `scrape-treats.md`) passed via `--urls <file>` on the CLI. The files are plain URL lists with no labelling — brand identity is implicit in the URL domain. A parallel file, `scraper/src/scraper-sources/sources.md`, contains brand metadata and raw inline HTML examples used as Copilot context when writing new scrapers; it is not parsed at runtime.

The `sourceRegistry.ts` maps URL domains to scraper functions and brand names, but this is fully disconnected from the URL list files. There is no single source of truth that ties together: a brand, its scraper ID, its domains, its supported food types, and its product URLs.

## Goals / Non-Goals

**Goals:**
- Replace the four flat URL list files with per-brand YAML source files in `scraper/sources/`
- Give each file a `scraper` field that maps to the `sourceRegistry` entry
- Organise product URLs by food type within each file (`dry`, `wet`, `treats`, `freeze-dried`)
- Replace `sources.md` with focused per-brand selector reference files (`<scraper-id>.selectors.md`) that serve as lean Copilot context for writing/editing scrapers
- Update the CLI `--urls` flow and `parseUrlListFile` to accept a YAML source file (or a directory of them)
- Keep `FoodType` enum authoritative for valid food type keys in YAML

**Non-Goals:**
- Changing scraper logic or selector extraction behaviour
- Migrating to a database or remote config store
- Validating URLs at load time (beyond presence in the list)
- Auto-generating YAML from existing markdown files (manual migration is fine at this scale)

## Decisions

### Decision 1: Per-brand YAML files in `scraper/sources/`

**Chosen:** `scraper/sources/<scraper-id>.yaml` — one file per scraper registration.

Two alternatives were considered:
- **Single `sources.yaml`** — simpler at first, but becomes hard to diff and scan as brand count grows. Adding a new brand means editing a shared file.
- **One file per food type** — preserves the current split, but doesn't help brand discoverability and still requires multiple edits when adding a new brand.

Per-brand files mirror the `sourceRegistry` entries (one-to-one by `scraper` ID), make brand-level changes self-contained, and are easy to locate.

**YAML shape:**
```yaml
scraper: acana-eu
brand: Acana
domain: emea.acana.com
products:
  dry:
    - https://emea.acana.com/en/dogs/dog-food/eu-aca-adult.html
  wet: []
  treats: []
  freeze-dried: []
```

Food type keys match the `FoodType` enum values (`dry`, `wet`, `treats`, `freeze-dried`). Missing keys default to empty.

### Decision 2: YAML loading via a new `loadSourceUrls` helper

The existing `parseUrlListFile` helper in `urlListParser.ts` handles the flat markdown format. Rather than modifying it (it may still be useful for the `--sitemap` path and one-off usage), a new `loadSourceUrls(yamlPath: string, foodType: FoodType): string[]` function will be added. The CLI `--urls` path will check the file extension: `.yaml`/`.yml` → new loader, otherwise → existing `parseUrlListFile`.

No third-party YAML parser is needed — Node.js `fs` + a lightweight inline parser is sufficient for this flat structure. However, since the project already uses `dotenv` and `xml2js` (both of which pull in `js-yaml` transitively in some versions), using `js-yaml` directly is preferred for correctness. If not available, `yaml` (the `yaml` npm package) is the fallback.

### Decision 3: Per-brand `*.selectors.md` replaces monolithic `sources.md`

`sources.md` is not parsed at runtime — its sole purpose is Copilot context. Splitting it into `<scraper-id>.selectors.md` files allows Copilot to be given a single, focused file when working on a specific scraper rather than a 200-line document of unrelated HTML.

Each file will contain:
- Brand name and homepage URL
- A representative HTML snippet showing the selectors used for title, ingredients, and composition
- Notes on any scraper-specific quirks (e.g. multi-locale URLs, product ID–based URLs)

The monolithic `sources.md` is deleted once all per-brand files are created.

### Decision 4: Extend `FoodType` enum to include `Treats` and `FreezeDried`

Currently `FoodType` only has `Dry` and `Wet`. The four markdown files imply four food types. Adding `Treats = "treats"` and `FreezeDried = "freeze-dried"` to the enum makes food type handling consistent across the codebase and valid for use as YAML keys.

## Risks / Trade-offs

- **[Risk] `js-yaml` may not be installed** → Check `package.json`; if absent, add it or use the `yaml` package instead. Either is a small dev dependency.
- **[Risk] Existing CLI usage broken during migration** → The old `scrape-*.md` files will be kept until all YAML files are created and the CLI is updated; delete only after smoke-testing.
- **[Risk] `selectors.md` files become stale** → Same risk that existed with `sources.md`; no worse, and easier to maintain per-brand.

## Migration Plan

1. Add `Treats` and `FreezeDried` to `FoodType` enum
2. Add `js-yaml` (or `yaml`) dependency
3. Create `scraper/sources/<scraper-id>.yaml` for each of the 7 registered scrapers, migrating URLs from the four markdown files
4. Create `scraper/sources/<scraper-id>.selectors.md` for each brand, extracting from `sources.md`
5. Add `loadSourceUrls` helper
6. Update CLI to route `.yaml` files through the new loader with a `--food-type` filter
7. Smoke-test with `ts-node src/scraper.ts --urls sources/acana-eu.yaml --food-type dry --no-sheets`
8. Delete the four `scrape-*.md` files and `src/scraper-sources/sources.md`

Rollback: the old markdown files are not deleted until step 8, so reverting the CLI change restores previous behaviour.

## Open Questions

- Should the CLI accept a **directory** (`--urls sources/`) and scrape all brands for a given food type in one pass, or keep the per-file invocation? (Scoped out for now — additive change if wanted later.)
- Should `zooplus` get a YAML source file even though it currently has no URL list? (Yes — create it with empty lists as a placeholder.)
