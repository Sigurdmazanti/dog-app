## Context

The ZooPlus scraper maps scraped table-cell labels to canonical nutrition/minerals fields using `productCompositionKeyMap.ts`. The lookup currently calls `name.includes(alias)` which is a plain substring test. Danish compound words (e.g. `"fedtsyre"` = fatty acids, `"råaske"` = crude ash) share letter sequences with shorter aliases (`"fedt"`, `"aske"`), so a row meant for a different field silently overwrites the correct value.

Both the nutrition and minerals key-map loops in `zooplus.ts` share the same bug. All future scraper targets would inherit it.

## Goals / Non-Goals

**Goals:**
- Replace `includes` with a Unicode-aware whole-word match in both lookup loops
- Keep the key-map data structures (`nutritionKeyMap`, `mineralsKeyMap`) unchanged
- Encapsulate the matching logic in a reusable helper so future scrapers don't reimplement it

**Non-Goals:**
- No changes to the maps themselves or to the canonical field names
- No changes to how values are parsed (that is `percentageStringToInt`'s job)
- No support for fuzzy / similarity matching — exact whole-word only

## Decisions

### Unicode-aware lookbehind/lookahead instead of `\b`

JavaScript's `\b` word boundary is not Unicode-aware: it relies on `\w = [a-zA-Z0-9_]` and treats `æ`, `ø`, `å` as non-word characters. This makes `\bfedt\b` incorrectly match inside `"råfedt"` because `å` creates a spurious boundary before `f`.

Instead, use negative lookbehind/lookahead with `\p{L}` (Unicode letter category, requires `u` flag):

```ts
new RegExp('(?<!\\p{L})' + escapeRegex(alias) + '(?!\\p{L})', 'iu')
```

- `(?<!\p{L})` — the character immediately before the alias must NOT be a Unicode letter
- `(?!\p{L})` — the character immediately after must NOT be a Unicode letter
- `i` flag — case-insensitive (already lowercased, but belt-and-braces)
- `u` flag — enables `\p{L}`

This correctly rejects `"fedtsyre"` for alias `"fedt"` (the `s` after  is `\p{L}`) and rejects `"råfedt"` (the `å` before is `\p{L}`).

**Alternative considered:** Split `name` on non-letter chars and compare tokens. Rejected — multi-word aliases like `"crude fat"` or `"calcium carbonate"` would not survive a single-token split cleanly.

### Regex compiled per call (no cache)

The number of aliases is small (< 30 total) and scraping is I/O-bound. Pre-compiling a regex map is an optimisation that adds complexity without measurable benefit.

### New helper file `matchesAlias.ts`

Isolating the helper keeps `zooplus.ts` focused on DOM parsing and makes the matching logic independently testable.

## Risks / Trade-offs

- **Multi-word aliases with internal spaces** (e.g. `"crude fat"`, `"sodium chloride"`) — the regex checks boundaries only at the outer edges of the alias string, so spaces within are treated as literals. This is correct behaviour: `"crude fat"` should match the label `"crude fat"` but not `"crude fatty"`.
- **Regex special characters in aliases** — if an alias ever contains `.`, `(`, etc. it could break the regex. Mitigation: `escapeRegex` utility escapes all special chars before building the pattern.

## Migration Plan

1. Create `scraper/src/helpers/matchesAlias.ts` with the helper + `escapeRegex` util
2. Replace both `name.includes(alias)` occurrences in `zooplus.ts`
3. TypeScript compile check (`tsc --noEmit`)
4. Manual test scrape on a product known to include "fedtsyre" to confirm it no longer maps to fat
