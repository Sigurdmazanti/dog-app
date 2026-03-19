# Scraper Project

## Package Manager

- This folder uses npm.
- Use npm commands in this folder (`npm install`, `npm run build`, `npm run dev`).
- Do not use yarn in `scraper/`.

Monorepo note:
- `app/` uses Yarn and has its own `yarn.lock`.
- `scraper/` uses npm and has its own `package-lock.json`.

## Usage

1. Place your `sitemap.xml` or a text file with one URL per line in the project folder.
2. Run the scraper:

```
node scraper.js sitemap sitemap.xml
```
Or for a list of URLs:
```
node scraper.js list urls.txt
```

- Scraped data will be saved to `output.json` and `output.csv`.
- Adjust the scraping logic in `scraper.js` to extract the data you need (e.g., use regex or Cheerio selectors).
- The concurrency limit is set to 5 by default to avoid bans; you can change this in the script.

## Dependencies
- axios
- cheerio
- xml2js
- csv-writer
- p-limit
- openai

## AI Mapping Configuration

The scraper can use AI-assisted composition mapping before exporting data. The AI step is optional and automatically falls back to alias-based mapping if configuration is missing or the AI response is invalid.

Environment variables:
- `OPENAI_API_KEY`: Required to enable AI mapping.
- `OPENAI_MODEL`: Optional model override. Defaults to `gpt-5-nano`.
- `OPENAI_TIMEOUT_MS`: Optional timeout in milliseconds for each AI request. Defaults to `8000`.
- `OPENAI_MAX_RETRIES`: Optional retry count for failed AI requests. Defaults to `1`.

Behavior:
- Missing `OPENAI_API_KEY`: AI mapping is skipped and alias-based fallback mapping is used.
- Invalid JSON or schema mismatch from AI: response is rejected and fallback mapping is used.
- Timeout or API error: scraper logs a warning and continues with fallback mapping.

Install dependencies with:
```
npm install
```
