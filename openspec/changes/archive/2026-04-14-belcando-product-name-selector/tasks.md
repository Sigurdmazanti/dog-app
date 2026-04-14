## 1. `belcando.ts` — Scraper Update

- [x] 1.1 Replace `extractTitle` to read `$('.product-detail-name-manufacturer').first().text().trim()` and `$('h1.product-detail-name').first().text().trim()`, filter empty strings, and join with a single space
- [x] 1.2 Verify the updated `extractTitle` returns "Vetline Weight Control" for the new HTML structure and falls back to just the `h1` text when the manufacturer span is absent

## 2. `belcando.selectors.md` — Selector Reference Update

- [x] 2.1 Replace the HTML example block with the new `.product-detail-name-container` structure containing `span.product-detail-name-manufacturer` and `h1.product-detail-name`
- [x] 2.2 Update the Title row in the Selectors table to document the concatenation approach: manufacturer span + h1 text, filtered and joined with a space
- [x] 2.3 Add a note explaining the fallback behaviour when the manufacturer span is absent
