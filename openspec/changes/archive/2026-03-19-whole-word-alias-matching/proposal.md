## Why

The scraper's key-map lookup uses a plain `String.includes()` substring match, causing false positives with semantically distinct Danish compound words. For example, `"fedtsyre"` (fatty acids) matches the alias `"fedt"` (fat), silently mapping fatty-acid rows into the fat field. The fix is to require that aliases match as whole words, accounting for Unicode letters so that compound words like `"fedtsyre"` and `"råaske"` can never partially trigger an alias.

## What Changes

- Add a `matchesAlias(name: string, alias: string): boolean` helper that uses Unicode-aware negative lookbehind/lookahead to enforce whole-word matching
- Replace the two `name.includes(alias)` call-sites in `scraper/src/scrapers/zooplus.ts` with `matchesAlias(name, alias)`

## Capabilities

### New Capabilities

- `whole-word-alias-matching`: A lookup helper that matches a scraped cell label against an alias only when the alias appears as a complete word (not as a sub-sequence of a larger word), using Unicode-aware regex

### Modified Capabilities

<!-- No existing spec-level requirements are changing — only the internal matching strategy in zooplus.ts -->

## Impact

- `scraper/src/scrapers/zooplus.ts` — two `includes` call-sites replaced
- `scraper/src/helpers/` — new `matchesAlias.ts` helper file introduced
- No Supabase schema changes; no mobile app code affected
- Hot-reload only; no EAS build required
