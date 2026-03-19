## 1. matchesAlias.ts (new helper)

- [x] 1.1 Create `scraper/src/helpers/matchesAlias.ts` with an internal `escapeRegex` utility that escapes all regex special characters in a string
- [x] 1.2 Implement and export `matchesAlias(name: string, alias: string): boolean` using a Unicode-aware `(?<!\p{L})…(?!\p{L})` regex with the `iu` flags
- [x] 1.3 Verify TypeScript compiles cleanly (`tsc --noEmit` in the scraper package)

## 2. zooplus.ts

- [x] 2.1 Import `matchesAlias` from the new helper in `scraper/src/scrapers/zooplus.ts`
- [x] 2.2 Replace `name.includes(alias)` in the nutrition key-map loop with `matchesAlias(name, alias)`
- [x] 2.3 Replace `name.includes(alias)` in the minerals key-map loop with `matchesAlias(name, alias)`
- [x] 2.4 Verify TypeScript compiles cleanly after both replacements
