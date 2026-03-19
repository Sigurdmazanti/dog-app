## Why

The scraper currently captures only a subset of composition data, so Google Sheets misses many minerals, salts, vitamins, amino acids, vitamin-like compounds, fatty acids, and sugar alcohol values that are present on product pages. Adding broader alias-aware extraction now improves data completeness and reduces manual post-processing.

## What Changes

- Extend scraper composition models to include new grouped fields for minerals, salts, vitamins (including B-variants), amino-acid/derivatives, vitamin-like compounds, fatty acids, and sugar alcohols.
- Add alias-based key mapping entries in product composition key maps so multilingual and synonym labels normalize to one canonical field per metric.
- Use English canonical property names in `productComposition.ts` (for example `phosphorus`, `sodium`, `potassium`, `iron`) while preserving Danish and other aliases in mapping inputs.
- Update scrape result interfaces to include the new composition groups and values.
- Add fallback handling in scraper orchestration so missing values resolve consistently (empty or null-safe defaults) and downstream exports remain stable, applied per data group via `applyNumericFallbacks`.
- Update Google Sheets appender to export all newly captured composition fields using existing comment markers and explicit column ordering.

## Capabilities

### New Capabilities
- `scraped-product-composition-export`: Extract, normalize, and export expanded product composition nutrient/supplement fields from scraped pages into typed results and Google Sheets rows.

### Modified Capabilities
- (none)

## Impact

- Affected code: scraper interfaces, composition key maps, scraper parsing logic, scrape result shape, and Google Sheets append logic under `scraper/src`.
- Affected systems: scraping pipeline output and Google Sheets dataset schema/order.
- Dependencies/APIs: no external API changes; internal TypeScript contracts for composition and result payloads will expand.
- Runtime/build impact: scraper-only code path; no mobile app runtime impact and no EAS rebuild required.
