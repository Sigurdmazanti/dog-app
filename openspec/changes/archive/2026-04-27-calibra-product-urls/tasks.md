## 1. calibra.yaml

- [x] 1.1 Change `domain` field from `mycalibra.eu` to `calibrastore.co.uk`
- [x] 1.2 Populate `products.dry` with the 77 product URLs from `calibrastore.co.uk/collections/dry-dog-food`
- [x] 1.3 Populate `products.wet` with the 29 product URLs from `calibrastore.co.uk/collections/wet-dog-food`
- [x] 1.4 Populate `products.treats` with the 38 unique product URLs from `calibrastore.co.uk/collections/dog-treats` (remove the duplicate `calibra-joy-dog-classic-fish-chicken-sandwich` entry)
- [x] 1.5 Set `productCounts.dry: 77`, `productCounts.wet: 29`, `productCounts.treats: 38`, `productCounts.total: 144`
- [x] 1.6 Verify: `loadSourceUrls('calibra.yaml', 'dry')` returns 77 URLs; `loadSourceUrls('calibra.yaml', 'wet')` returns 29; `loadSourceUrls('calibra.yaml', 'treats')` returns 38

## 2. Source registry

- [x] 2.1 In `scraper/src/sourceRegistry.ts`, change the Calibra entry domain string from `'mycalibra.eu'` to `'calibrastore.co.uk'`
- [x] 2.2 Verify: `findSource('https://calibrastore.co.uk/collections/dry-dog-food/products/calibra-dog-life-adult-medium-breed-chicken')` returns the entry with `brand: 'Calibra'` and `scrape: scrapeCalibra`

## 3. Selector reference

- [x] 3.1 In `scraper/sources/calibra.selectors.md`, update all occurrences of `mycalibra.eu` to `calibrastore.co.uk`
- [x] 3.2 Verify: run the scraper against one live `calibrastore.co.uk` product URL and confirm `title`, `ingredientsDescription`, and `compositionText` are all non-empty strings
