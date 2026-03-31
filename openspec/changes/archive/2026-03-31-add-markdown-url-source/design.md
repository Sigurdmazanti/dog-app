## Context

The scraper's batch mode currently accepts two input formats: sitemap XML (`--sitemap`) parsed by `sitemapParser.ts`, and plain newline-delimited text files (`--urls`) parsed by `urlListParser.ts`. Both feed URLs into `runBatch()`.

Users want to maintain URL lists as `.md` files with markdown formatting — headings for organisation, bullet lists for URLs, and comments — rather than flat text or verbose XML. The existing `urlListParser.ts` already skips `#`-prefixed lines and blank lines, but does not strip markdown list prefixes (`- `, `* `, `1. `) or extract URLs from markdown link syntax (`[text](url)`).

## Goals / Non-Goals

**Goals:**
- Allow `.md` files as input to `--urls`, transparently handling markdown syntax
- Support bullet lists (`- url`, `* url`), numbered lists (`1. url`), bare URLs, and markdown links (`[text](url)`)
- Maintain backward compatibility — existing plain text files continue to work

**Non-Goals:**
- Adding a separate `--markdown` CLI flag (reuse `--urls`)
- Parsing rich markdown (tables, code blocks, nested lists)
- Remote markdown file fetching (local files only, matching existing `--urls` behaviour)

## Decisions

### Enhance `urlListParser.ts` rather than adding a new parser

**Rationale:** The existing parser already handles the file-reading, line-splitting, blank-line/comment skipping logic. Markdown stripping is additive — strip list prefixes and extract link URLs before the existing URL validation. A single parser keeps the code path simple and avoids branching in `scraper.ts`.

**Alternative considered:** A separate `markdownUrlParser.ts` was considered but rejected because the line-level logic is identical — the only difference is prefix stripping, which can be a helper function within the existing module.

### Auto-detect markdown formatting per line, not per file

**Rationale:** Rather than checking the file extension (`.md` vs `.txt`), each line is processed uniformly: strip any markdown list prefix, then check for markdown link syntax. This means a `.txt` file with a `- ` prefix still works, and a `.md` file with bare URLs also works. No ambiguity or file-extension sniffing needed.

### Extract only the first URL per line

**Rationale:** Each line should map to at most one URL. If a markdown link is present, extract the URL from the parentheses. Otherwise treat the entire (stripped) line as a URL. This keeps the parser predictable and avoids edge cases with multiple URLs on one line.

## Risks / Trade-offs

- **Risk**: Lines starting with `#` are currently treated as comments, but in markdown `#` is a heading. → **Mitigation**: This is acceptable — headings aren't URLs, so skipping them is the correct behaviour for both interpretations.
- **Risk**: Numbered-list stripping could theoretically match a line like `3. 14.example.com`. → **Mitigation**: Extremely unlikely in practice. The regex will require a digit-dot-space prefix (`/^\d+\.\s/`) which won't match real URLs.
