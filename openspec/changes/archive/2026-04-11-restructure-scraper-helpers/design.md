## Context

`scraper/src/helpers/` contains 13 files spanning five distinct concerns: data parsing, nutrition calculations, product composition processing, external output (Google Sheets), and general utilities. All 13 are siblings in one flat directory with no grouping, making it difficult to understand module boundaries or find relevant code.

Current files:

| File | Concern |
|---|---|
| `sitemapParser.ts` | Parsing |
| `urlListParser.ts` | Parsing |
| `percentageStringToInt.ts` | Parsing |
| `nutritionCalculator.ts` | Nutrition |
| `waterAmountMapper.ts` | Nutrition |
| `aiProductCompositionMapper.ts` | Composition |
| `productCompositionKeyMap.ts` | Composition |
| `googleSheetsAppender.ts` | Output |
| `logger.ts` | Utils |
| `matchesAlias.ts` | Utils |
| `loadSourceUrls.ts` | Utils |
| `checkMissingFields.ts` | Utils |
| `runScraper.ts` | Runner |

## Goals / Non-Goals

**Goals:**
- Group helpers into named subdirectories that reflect their domain
- Update all import paths in `scraper/src/` to reflect the new locations
- Establish clear placement rules so future helpers have an obvious home

**Non-Goals:**
- Modifying any logic inside the moved files
- Adding barrel/index files (each consumer imports the specific file it needs)
- Touching `scraper/src/scrapers/`, `scraper/src/interfaces/`, or anything outside `scraper/`

## Decisions

### Subdirectory layout

```
helpers/
  parsing/      ← sitemapParser.ts, urlListParser.ts, percentageStringToInt.ts
  nutrition/    ← nutritionCalculator.ts, waterAmountMapper.ts
  composition/  ← aiProductCompositionMapper.ts, productCompositionKeyMap.ts
  output/       ← googleSheetsAppender.ts
  utils/        ← logger.ts, matchesAlias.ts, loadSourceUrls.ts, checkMissingFields.ts
  runScraper.ts ← stays at helpers root (it is itself a top-level orchestration entry point)
```

**Why five subdirs over a single `utils/`?**  
`utils/` as a catch-all just recreates the flat-folder problem. Named subdirs (`parsing/`, `nutrition/`, `composition/`, `output/`) communicate intent at a glance and create clear rules for where new files go.

**Why no barrel `index.ts` per subdirectory?**  
Barrels obscure what is actually imported, complicate tree-shaking analysis, and require maintenance whenever files are added or removed. Direct file imports are simpler and already the pattern used in this codebase.

**Why does `runScraper.ts` stay at the `helpers/` root?**  
It is the orchestration entry point consumed by `scraper.ts` and `batchScraper.ts`. Nesting it inside a subdirectory would imply it is a peer of other domain helpers; keeping it at root signals it sits above them.

### Import path strategy

All consumers update to the new relative path directly — no aliasing or path remapping in `tsconfig.json`. The scraper package is small enough that path literals are easy to audit and `tsconfig.json` already uses `"paths": {}`.

## Risks / Trade-offs

- **Missed import** — a consumer that imports from `../helpers/<file>` that was not caught during the audit will get a compile error. Mitigation: run `tsc --noEmit` after the move to catch all broken paths before committing.
- **Git history fragmentation** — moving files breaks `git log --follow` for some tools. Mitigation: use `git mv` for each file so Git records the rename rather than a delete+add.

## Migration Plan

1. Create the five subdirectories inside `helpers/`
2. `git mv` each file to its new location
3. Update all import statements in affected files (`scraper.ts`, `batchScraper.ts`, `sourceRegistry.ts`, files in `scrapers/`)
4. Run `tsc --noEmit` from `scraper/` to verify zero compile errors
5. Commit as a single atomic change with message: `refactor(scraper): reorganise helpers into domain subdirectories`
