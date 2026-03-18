# Scraper Project

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

Install dependencies with:
```
npm install
```
