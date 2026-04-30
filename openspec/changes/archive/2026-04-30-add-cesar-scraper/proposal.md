## Why

The scraper has no coverage for Cesar (cesar.com), a US wet/dry/treats dog food brand. Cesar product pages currently present nutrition information as images rather than HTML markup, so a real composition extractor cannot be implemented yet — but registering the source and seeding the product URLs lets us track the catalogue, reuse the discovery/diff tooling, and slot in real extractors once the markup is available (or once OCR/image-based extraction is introduced).

## What Changes

- New scraper file `scraper/src/scrapers/cesar.ts` with stub extractors (title from `h1`, empty ingredients description, empty composition text) since nutrition data is image-only
- New source file `scraper/sources/cesar.json` populated with the supplied wet (97), dry (3), and treats (3) product URLs; non-product `recipe-finder` URL excluded
- New entry in `sourceRegistry.ts` mapping `cesar.com` to the new scraper

## Capabilities

### New Capabilities

- `cesar-scraper`: Registers `cesar.com` as a known source and extracts the product title from `cesar.com` product pages. Ingredient and composition extraction is intentionally a no-op pending image-based nutrition data extraction.

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- `scraper/src/scrapers/cesar.ts` — new file
- `scraper/src/sourceRegistry.ts` — one new import and registry entry
- `scraper/sources/cesar.json` — new source definition with product URLs
- No schema changes, no app-side changes, no new dependencies
- Mobile app (iOS/Android) is unaffected; this is scraper-only and does not require an EAS rebuild
