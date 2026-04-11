## Why

Avlskovgaard is a Danish pet food brand with a Shopify-based product catalogue at `avlskovgaard.dk`. Adding a scraper for this source expands the scraper's coverage of Danish wet/topping dog food products with nutritional data presented in a table format.

## What Changes

- Add `avlskovgaard.yaml` source configuration with `scraper`, `brand`, `domain`, and `products` sections (URLs supplied separately)
- Add `avlskovgaard.selectors.md` selector reference documenting the Shopify page structure and Danish-language field mapping
- Add `avlskovgaard.ts` scraper implementation registered in `sourceRegistry.ts`

## Capabilities

### New Capabilities

- `avlskovgaard-scraper`: Scraper for `avlskovgaard.dk` product pages — extracts product title (from `div.product__title h1`), ingredients text (from the `<p>` following the `INGREDIENSER` heading inside `.accordion__content.rte`), and analytical constituents (from `table.nutrition-table` rows within the same accordion content block)

### Modified Capabilities

- `scraper-source-registry`: Route `avlskovgaard.dk` URLs to the new Avlskovgaard scraper via `findSource`

## Impact

- New files: `scraper/sources/avlskovgaard.yaml`, `scraper/sources/avlskovgaard.selectors.md`, `scraper/src/scrapers/avlskovgaard.ts`
- Modified files: `scraper/src/sourceRegistry.ts` (add Avlskovgaard entry)
- No auth, Supabase schema, or mobile app changes required
