## 1. Scraper module — `scraper/src/scrapers/brit.ts`

- [x] 1.1 Create `scraper/src/scrapers/brit.ts` with a `findLabelledParagraph($, labelText)` helper that iterates all `<p>` elements, matches the first `<strong>` child's trimmed text to `labelText`, and returns the paragraph text with the `<strong>` removed and the remainder trimmed (returns empty string if not found)
- [x] 1.2 Implement `extractTitle` using `$('h1[itemprop="name"]').first().text().trim()`
- [x] 1.3 Implement `extractIngredientsDescription` using `$('p.composition').clone().find('strong').remove().end().text().trim()`
- [x] 1.4 Implement `extractCompositionText` to call `findLabelledParagraph` for `"Analytical ingredients:"` and `"Metabolizable energy:"`, then join non-empty results with `'\n'`
- [x] 1.5 Wire all three extract functions into `runScraper` and export as `scrapeBrit`
- [x] 1.6 Verify: run a quick smoke test against the sample markup from the proposal using `npx ts-node` and confirm title, composition, and analytical fields extract correctly

## 2. Source registry — `scraper/src/sourceRegistry.ts`

- [x] 2.1 Import `scrapeBrit` from `'./scrapers/brit'` in `sourceRegistry.ts`
- [x] 2.2 Add `{ domain: 'brit-petfood.com', brand: 'Brit', scrape: scrapeBrit }` to the `sourceRegistry` array
- [x] 2.3 Verify: confirm `findSource('https://brit-petfood.com/en/products/dogs/579959-...')` returns the Brit entry

## 3. Source YAML — `scraper/sources/brit.yaml`

- [x] 3.1 Create `scraper/sources/brit.yaml` with `scraper: brit`, `brand: Brit`, `domain: brit-petfood.com`
- [x] 3.2 Add `products.dry` list with all 49 dry product URLs
- [x] 3.3 Add `products.wet` list with all 47 wet product URLs (excluding the malformed `/en/node/1095385` URL)
- [x] 3.4 Add `products.treats` list with all 55 treat product URLs
- [x] 3.5 Add `products.misc` list with all 10 supplement/vitamin product URLs
- [x] 3.6 Add `productCounts` map: `dry: 49`, `wet: 47`, `treats: 55`, `misc: 10`, `total: 161`
- [x] 3.7 Verify: count each list and confirm it matches the corresponding `productCounts` value

## 4. Selector reference — `scraper/sources/brit.selectors.md`

- [x] 4.1 Create `scraper/sources/brit.selectors.md` with homepage URL (`https://brit-petfood.com/`), a representative HTML excerpt from a product page, and a selectors table covering: title (`h1[itemprop="name"]`), composition (`p.composition` with strong-strip), analytical constituents (`findLabelledParagraph` for `"Analytical ingredients:"`), and metabolizable energy (`findLabelledParagraph` for `"Metabolizable energy:"`)
