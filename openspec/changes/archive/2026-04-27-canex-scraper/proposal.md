## Why

Canex (canex-shop.dk) is a Danish dog food retailer selling HobbyFirst Canex products (dry food and treats). Adding a scraper expands product coverage. The site is entirely in Danish, so the scraper must ensure both the ingredient list and composition data are translated to English before being stored — the AI composition mapper handles Danish nutritional terms well (the key maps already include Danish aliases), but the raw `ingredientsDescription` text needs explicit translation since it is returned verbatim.

## What Changes

- Add a new Canex scraper (`scraper/src/scrapers/canex.ts`) that extracts product title, ingredient list, and analytical composition from canex-shop.dk product pages.
- Add a source YAML (`scraper/sources/canex.yaml`) with 20 dry food and 24 treat product URLs.
- Register the `canex-shop.dk` domain in `scraper/src/sourceRegistry.ts`.
- Add a selector reference document (`scraper/sources/canex.selectors.md`) documenting the CSS selectors used.
- Ensure the `ingredientsDescription` is translated from Danish to English — either by extending the AI mapper prompt to also translate ingredient text, or by performing a separate translation step in the scraper's extractor before returning.

## Capabilities

### New Capabilities
- `canex-scraper`: Scraper for canex-shop.dk that extracts product data from Danish-language pages, translates ingredient descriptions to English, and maps analytical composition via the existing AI mapper.

### Modified Capabilities
- `ai-product-composition-mapping`: The AI mapper prompt may need to be extended to also translate and return the ingredient description in English when the input text is in a non-English language, rather than only mapping nutritional values.

## Impact

- **Code**: New scraper file, source YAML, selector reference, and source registry entry. Possible modification to `aiProductCompositionMapper.ts` prompt to handle ingredient translation.
- **Dependencies**: No new packages required — uses existing Cheerio, Axios, and OpenAI stack.
- **Data**: 44 new products (20 dry, 24 treats) will be scrapeable via batch or single-URL CLI.
