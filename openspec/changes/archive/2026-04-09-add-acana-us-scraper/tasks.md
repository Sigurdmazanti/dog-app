## 1. Scraper File

- [x] 1.1 Create `scraper/src/scrapers/acana-us.ts` exporting `scrapeAcanaUs`, using the same three Cheerio selectors as `acana-eu.ts`
- [x] 1.2 Verify the file compiles without TypeScript errors

## 2. Source Registry

- [x] 2.1 Import `scrapeAcanaUs` in `scraper/src/sourceRegistry.ts`
- [x] 2.2 Add `{ domain: 'www.acana.com', scrape: scrapeAcanaUs }` entry to `sourceRegistry`
- [x] 2.3 Verify `findSource` returns the US scraper for a `www.acana.com` URL and still returns the EU scraper for an `emea.acana.com` URL
