## Why

The scraper currently supports two batch input formats: sitemap XML (`--sitemap`) and plain text URL lists (`--urls`). Users want to maintain URL lists as markdown files (`.md`) that allow organizational headings, bullet/numbered-list formatting, and inline comments — making them easier to read, edit, and version-control than raw text or verbose XML.

## What Changes

- Enhance the URL list parser to recognise markdown-formatted files, stripping bullet prefixes (`- `, `* `), numbered-list prefixes (`1. `), and markdown link syntax (`[text](url)`) to extract bare URLs.
- Accept `.md` files via the existing `--urls` flag — no new CLI flag needed. The parser auto-detects markdown formatting based on line content.
- Markdown headings (`# …`, `## …`) and blank lines are treated as non-URL lines and silently skipped, allowing users to organise URLs under section headers.

## Capabilities

### New Capabilities
- `markdown-url-list-parsing`: Parse markdown-formatted `.md` files as a URL source for batch scraping, extracting URLs from bullet lists, numbered lists, bare lines, and markdown links.

### Modified Capabilities
- `batch-scraper-processing`: The "Batch processing from URL list file" requirement expands to accept markdown-formatted files in addition to plain newline-delimited text files.

## Impact

- **Code**: `scraper/src/helpers/urlListParser.ts` — extend `parseUrlListFile` (or add a sibling markdown parser) to handle markdown syntax.
- **No new dependencies**: Markdown line-stripping is simple string manipulation; no markdown parsing library needed.
- **Backwards-compatible**: Existing plain text URL files continue to work unchanged.
