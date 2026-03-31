## 1. URL List Parser Enhancement

- [x] 1.1 Add a `stripMarkdownPrefix` helper function in `scraper/src/helpers/urlListParser.ts` that strips bullet prefixes (`- `, `* `), numbered-list prefixes (`\d+. `), and leading whitespace from a line
- [x] 1.2 Add a `extractMarkdownLinkUrl` helper function that detects `[text](url)` syntax and returns the URL from the parentheses, or returns the line unchanged if no link syntax is found
- [x] 1.3 Update `parseUrlListFile` to pipe each line through `stripMarkdownPrefix` → `extractMarkdownLinkUrl` before the existing blank/comment filtering
- [x] 1.4 Verify by running `npm run dev -- --urls test-urls.md` with a sample markdown file containing headings, bullet URLs, numbered URLs, markdown links, and bare URLs
