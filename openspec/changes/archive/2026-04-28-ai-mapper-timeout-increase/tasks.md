## 1. AI Mapper Timeout

- [x] 1.1 In `scraper/src/helpers/composition/aiProductCompositionMapper.ts`, change `DEFAULT_TIMEOUT_MS` from `60_000` to `120_000`
- [x] 1.2 Verify the change by running a single-URL scrape: `npx ts-node src/scraper.ts "https://canex-shop.dk/produkter/puppy-junior-brocks-12-kg/" --food-type dry --no-sheets`
