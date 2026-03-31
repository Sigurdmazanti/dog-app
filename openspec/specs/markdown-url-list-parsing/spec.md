## Purpose

Define how the scraper's URL list parser handles markdown-formatted input files, extracting URLs from bullet lists, numbered lists, markdown links, and bare lines.

## Requirements

### Requirement: Markdown bullet-list URLs are extracted
The system MUST extract URLs from markdown unordered list items prefixed with `- ` or `* `.

#### Scenario: Dash-prefixed URL extracted
- **WHEN** a URL list file contains the line `- https://example.com/product`
- **THEN** the parser returns `https://example.com/product` with the `- ` prefix stripped

#### Scenario: Asterisk-prefixed URL extracted
- **WHEN** a URL list file contains the line `* https://example.com/product`
- **THEN** the parser returns `https://example.com/product` with the `* ` prefix stripped

#### Scenario: Indented bullet URL extracted
- **WHEN** a URL list file contains the line `  - https://example.com/product` (leading whitespace)
- **THEN** the parser returns `https://example.com/product` with whitespace and prefix stripped

### Requirement: Markdown numbered-list URLs are extracted
The system MUST extract URLs from markdown ordered list items prefixed with `<digit(s)>. `.

#### Scenario: Numbered-list URL extracted
- **WHEN** a URL list file contains the line `1. https://example.com/product`
- **THEN** the parser returns `https://example.com/product` with the `1. ` prefix stripped

#### Scenario: Multi-digit numbered-list URL extracted
- **WHEN** a URL list file contains the line `12. https://example.com/product`
- **THEN** the parser returns `https://example.com/product` with the `12. ` prefix stripped

### Requirement: Markdown link URLs are extracted
The system MUST extract the URL from markdown link syntax `[text](url)`.

#### Scenario: Markdown link URL extracted
- **WHEN** a URL list file contains the line `- [Acana Grasslands](https://emea.acana.com/en/dogs/dog-food/eu-aca-grasslands.html)`
- **THEN** the parser returns `https://emea.acana.com/en/dogs/dog-food/eu-aca-grasslands.html`

#### Scenario: Bare markdown link without list prefix
- **WHEN** a URL list file contains the line `[Product Page](https://example.com/product)`
- **THEN** the parser returns `https://example.com/product`

### Requirement: Markdown headings are skipped
The system MUST skip lines that are markdown headings (starting with one or more `#` followed by a space).

#### Scenario: Heading line skipped
- **WHEN** a URL list file contains the line `## Acana Products`
- **THEN** the parser skips that line and does not include it in the returned URL list

### Requirement: Bare URLs remain supported
The system MUST continue to extract bare URLs (lines containing only a URL with no markdown formatting).

#### Scenario: Bare URL extracted
- **WHEN** a URL list file contains the line `https://example.com/product`
- **THEN** the parser returns `https://example.com/product` unchanged
