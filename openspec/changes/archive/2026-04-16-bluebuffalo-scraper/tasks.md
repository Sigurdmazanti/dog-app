## 1. Scraper implementation (`scraper/src/scrapers/bluebuffalo.ts`)

- [x] 1.1 Create `scraper/src/scrapers/bluebuffalo.ts` with `scrapeBluebuffalo` function using `runScraper`
- [x] 1.2 Implement `extractTitle`: find `[role=tab]` button text, compose cleaned `h1` text (strip `™`/`®`) + `h3[itemprop=name]` text; fall back to `h3[itemprop=name]` alone when `h1` is absent
- [x] 1.3 Implement `extractIngredientsDescription`: locate the Ingredients tabpanel via the `aria-controls` attribute of the "Ingredients" tab button; iterate child elements of the ingredient wrapper, reading `data-tag-text` from anchor tags and text content from spans; join in DOM order with `, `
- [x] 1.4 Implement `extractCompositionText`: locate the Guaranteed Analysis tabpanel via the `aria-controls` attribute of the "Guaranteed Analysis" tab button; map each `tr[role=row]` to `Name: Value` and join with `\n`
- [x] 1.5 Verify the scraper compiles (`yarn tsc --noEmit` from `scraper/`)

## 2. Source registry (`scraper/src/sourceRegistry.ts`)

- [x] 2.1 Import `scrapeBluebuffalo` from `./scrapers/bluebuffalo`
- [x] 2.2 Add `{ domain: 'bluebuffalo.com', brand: 'Blue Buffalo', scrape: scrapeBluebuffalo }` entry to `sourceRegistry`
- [x] 2.3 Verify registry compiles and `findSource` resolves a sample `bluebuffalo.com` URL to the new entry

## 3. Source YAML (`scraper/sources/bluebuffalo.yaml`)

- [x] 3.1 Create `scraper/sources/bluebuffalo.yaml` with `scraper: bluebuffalo`, `brand: Blue Buffalo`, `domain: bluebuffalo.com`, and empty `products` lists per food type
- [ ] 3.2 Populate `products` lists with the product URLs provided by the user
- [ ] 3.3 Update `productCounts` totals to match the populated URL lists

## 4. Selector reference (`scraper/sources/bluebuffalo.selectors.md`)

- [x] 4.1 Create `scraper/sources/bluebuffalo.selectors.md` with homepage URL, scraper file reference, domain, representative HTML snippet (h1, h3, tablist, Guaranteed Analysis table, Ingredients tags panel), and selectors table
- [x] 4.2 Add notes on tab ID strategy (aria-controls lookup), trademark stripping regex, ingredient anchor vs span handling, and Guaranteed Analysis row format
