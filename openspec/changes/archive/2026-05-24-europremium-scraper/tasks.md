## 1. Source JSON (`scraper/sources/europremium.json`)

- [x] 1.1 Create `scraper/sources/europremium.json` with `scraper`, `brand`, `domain`, `discovery` (listings, pagination, productLinkSelector), and `products` sections for `dry`, `wet`, `treats`, and `misc` — populated with the provided URLs
- [x] 1.2 Verify `loadSource("europremium.json", "dry")` returns the expected dry product URL list

## 2. Scraper module (`scraper/src/scrapers/europremium.ts`)

- [x] 2.1 Create `scraper/src/scrapers/europremium.ts`
- [x] 2.2 Verify scraper runs against a dry product URL (`https://europremium.com/en/products/adult-light`) and returns non-empty title, ingredientsDescription, and compositionText

## 3. Source registry (`scraper/src/sourceRegistry.ts`)

- [x] 3.1 Add `europremium.com` → `scrapeEuroPremium` mapping in `sourceRegistry.ts`
- [x] 3.2 Verify `findSource("https://europremium.com/en/products/adult-light")` returns the EuroPremium entry with `brand: "EuroPremium"`

## 4. Selector reference (`scraper/sources/europremium.selectors.md`)

- [x] 4.1 Create `scraper/sources/europremium.selectors.md`
