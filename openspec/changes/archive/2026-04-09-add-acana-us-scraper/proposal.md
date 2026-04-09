## Why

The scraper supports Acana EU (`emea.acana.com`) but has no coverage for the Acana US storefront (`www.acana.com`). Adding a US scraper expands product data collection to the North American market using the same page structure that already works for the EU site.

## What Changes

- New scraper file `scraper/src/scrapers/acana-us.ts` implementing the same Cheerio selectors as `acana-eu.ts`
- New entry in `sourceRegistry.ts` mapping `www.acana.com` to the new scraper

## Capabilities

### New Capabilities

- `acana-us-scraper`: Scrapes product title, ingredients description, and composition text from `www.acana.com` product pages using the existing Cheerio selector pattern

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- `scraper/src/scrapers/acana-us.ts` — new file
- `scraper/src/sourceRegistry.ts` — one new import and registry entry
- No schema changes, no app-side changes, no new dependencies
