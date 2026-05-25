## Why

Dr. Clauder's is a German pet food brand with a broad range of dog food products (dry, wet, treats, supplements) sold via `dr-clauder.com`. Adding a scraper expands the product database with another popular brand.

## What Changes

- New scraper module at `scraper/src/scrapers/dr-clauders.ts` that extracts title, ingredients description, and analytical constituents from `dr-clauder.com` product pages
- New source JSON at `scraper/sources/dr-clauders.json` with food-type buckets: `dry`, `wet`, `treats`, `misc`
- Source registry entry mapping `dr-clauder.com` to the new scraper
- Selector reference documentation at `scraper/sources/dr-clauders.selectors.md`

## Capabilities

### New Capabilities

- `dr-clauders-scraper`: Scrapes product title, composition, and analytical constituents from `dr-clauder.com` product pages using Cheerio selectors targeting the product detail markup

### Modified Capabilities

## Impact

- `scraper/src/scrapers/dr-clauders.ts` — new file
- `scraper/sources/dr-clauders.json` — new file
- `scraper/sources/dr-clauders.selectors.md` — new file
- `scraper/src/sourceRegistry.ts` — new domain entry added
