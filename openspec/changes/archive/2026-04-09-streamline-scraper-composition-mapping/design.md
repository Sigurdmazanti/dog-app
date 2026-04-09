## Context

All scrapers in `scraper/src/scrapers/` follow a fixed pipeline:
1. Fetch URL with axios
2. Load HTML into cheerio
3. Extract brand-specific content (title, ingredientsDescription, compositionText)
4. Call `mapProductCompositionWithAI(compositionText)`
5. Log any notes from the result
6. Destructure 8 typed composition sections from `mappingResult.mappedSections`
7. Return the `ScrapeResult` object

Steps 1–2 and 4–7 are identical across all 6 scrapers (≈30 lines each), only step 3 differs. The proposal introduces `scraper-base-runner` to own steps 1–2 and 4–7, leaving each scraper to supply only step 3 logic.

## Goals / Non-Goals

**Goals:**
- Eliminate the duplicated fetch + AI-map + type-cast + return pipeline from all scrapers
- Each per-brand scraper file becomes a thin set of DOM-extraction callbacks
- New scrapers can be added by writing only a `ScraperDefinition` object — no boilerplate

**Non-Goals:**
- Changing scraper output shapes (`ScrapeResult`, `ScrapeRequest`)
- Merging scrapers together or auto-detecting the correct scraper for a URL
- Altering the AI mapping logic itself (`aiProductCompositionMapper.ts`)
- Adding retry logic, caching, or concurrency to the runner

## Decisions

### Decision 1 — Callback-based strategy over class inheritance

Each scraper passes extraction logic as plain functions into a shared `runScraper(request, extractors)` function rather than extending a base class.

**Rationale:** The existing scrapers are plain functions, not classes. Staying with functional style is consistent with the codebase. A single exported function with a typed config object is easier to read, test, and understand than a class hierarchy.

**Alternative considered:** Abstract base class with overridable methods — rejected because it would require converting all scrapers to classes and introduces OOP complexity for a problem that is purely one of code reuse.

### Decision 2 — `extractors` shape: three functions

```ts
interface ScraperExtractors {
  extractTitle: ($: CheerioAPI) => string;
  extractIngredientsDescription: ($: CheerioAPI) => string;
  extractCompositionText: ($: CheerioAPI, ingredientsDescription: string) => string;
}
```

`extractCompositionText` receives `ingredientsDescription` as a convenience parameter since several scrapers build `compositionText` by joining it with additional parsed content.

**Alternative considered:** A single `extract($)` callback returning `{ title, ingredientsDescription, compositionText }` — rejected because the three-function form makes each concern independently readable and avoids one large anonymous object.

### Decision 3 — Location: `scraper/src/helpers/runScraper.ts`

Placed in `helpers/` alongside the other shared utilities (`aiProductCompositionMapper.ts`, etc.) rather than a new `core/` folder, keeping the directory structure flat.

## Risks / Trade-offs

- **[Risk] Cheerio version pinning** → `runScraper.ts` imports `CheerioAPI` from cheerio; if scrapers ever need a different cheerio instance (e.g., xml mode) this interface would need extending. Mitigation: pass the `$` instance into extractors so scrapers can still customise load options if needed in the future.
- **[Trade-off] Slightly less flexibility per scraper** → All scrapers now share the same axios fetch with no custom headers or timeouts per brand. This is acceptable today; the `runScraper` signature can accept an optional `axiosConfig` parameter later if a brand requires it.
