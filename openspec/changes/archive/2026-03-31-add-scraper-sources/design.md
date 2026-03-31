## Context

The scraper subsystem (`scraper/src/`) currently has two scraper modules — `zooplus.ts` and `acana-eu.ts` — that extract product titles, ingredient descriptions, and nutritional composition from brand websites. Both follow the same pattern: fetch HTML with axios, parse with Cheerio, concatenate relevant text, and delegate to `mapProductCompositionWithAI()` for structured composition mapping.

`sources.md` defines five brands. Three (Advance, Almo Nature, Amanova) have URLs listed; the remaining two (Amanova, Animonda) do not list URLs but provide representative HTML markup. Acana EU already has a scraper; ZooPlus is already supported. Four new scrapers are needed.

The URL dispatch in `scraper.ts` has a bug: the `acana` branch is an `if` without `else`, meaning Acana URLs also fall through to the `throw new Error('Unsupported URL')` path in some code paths.

## Goals / Non-Goals

**Goals:**
- Add four scraper modules (`advance.ts`, `almo-nature.ts`, `amanova.ts`, `animonda.ts`) that follow the established pattern
- Fix the URL dispatch chain so every branch is properly `else if`
- Reuse 100% of existing infrastructure: axios, cheerio, `mapProductCompositionWithAI`, `ScrapeResult`, `ScrapeRequest`

**Non-Goals:**
- No changes to the AI composition mapper, interfaces, or Google Sheets export
- No new runtime dependencies
- No pagination or product-list crawling — each scraper handles a single product page
- No changes to the mobile app

## Decisions

### 1. One file per brand, consistent function signature
Each brand gets its own file in `scraper/src/scrapers/` exporting `async function scrape<Brand>(scrapeRequest: ScrapeRequest): Promise<ScrapeResult>`. This matches the existing convention.

**Rationale**: Isolating brand logic per file keeps selectors contained and makes it easy to add/remove brands without touching other scrapers.

### 2. Cheerio selectors derived from sample markup in sources.md
Each scraper's selectors target the CSS classes and element structures shown in the sample HTML in `sources.md`. The scrapers are purpose-built per brand, not generic.

**Rationale**: Each brand's HTML structure is different enough that a generic approach would add complexity without benefit. The AI mapper already handles text-to-structured-data generically.

### 3. Compose all raw text then delegate to AI mapper
Each scraper concatenates ingredients + analytical constituents + additives text into a single string and passes it to `mapProductCompositionWithAI()`, exactly like the existing scrapers do.

**Rationale**: The AI mapper already handles unit conversion and field mapping. Duplicating parsing logic per scraper would be error-prone.

### 4. Fix URL dispatch to proper if/else-if chain
Replace the current `if`/`if`/`else` pattern with a clean `if`/`else if`/`else if`/`else` chain. URL matching uses `url.includes('<domain-fragment>')`.

**Rationale**: The current code has a logic bug where Acana URLs also trigger the unsupported URL error because it's an `if` without `else if`.

## Risks / Trade-offs

- **[HTML structure changes]** → Brand websites may change markup at any time, breaking selectors. Mitigation: Each scraper is small and self-contained; fixing a broken scraper is a 5-minute edit.
- **[Amanova has no URL in sources.md]** → We'll use `amanova.com` as the URL pattern for matching, based on common Shopify store patterns visible in the markup. Mitigation: Confirm actual URLs against live site when first used.
- **[Animonda has no URL in sources.md]** → We'll use `animonda.com` as the URL pattern. Same mitigation as above.
