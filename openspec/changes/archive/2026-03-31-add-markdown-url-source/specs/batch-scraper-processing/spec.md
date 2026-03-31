## MODIFIED Requirements

### Requirement: Batch processing from URL list file
The system MUST accept a `--urls <path>` flag that reads a newline-delimited file of URLs — supporting both plain text and markdown-formatted files — filters them through the source registry, and processes each matching URL. Markdown list prefixes (`- `, `* `, `1. `), markdown link syntax (`[text](url)`), headings, and blank lines MUST be handled transparently.

#### Scenario: URL list file processed
- **WHEN** the CLI is invoked with `--urls ./products.txt` containing 10 URLs (8 matching registered sources)
- **THEN** the system processes the 8 matching URLs, skips the 2 unrecognised URLs, and outputs a summary

#### Scenario: Markdown URL list file processed
- **WHEN** the CLI is invoked with `--urls ./products.md` containing markdown-formatted URLs (headings, bullet lists, numbered lists)
- **THEN** the system extracts URLs from list items and markdown links, skips headings and blank lines, and processes matching URLs identically to a plain text file

#### Scenario: Empty lines and comments ignored
- **WHEN** the URL list file contains blank lines or lines starting with `#`
- **THEN** those lines are silently skipped without counting as failures or skips

#### Scenario: URL list file not found
- **WHEN** the CLI is invoked with `--urls ./missing.txt` and the file does not exist
- **THEN** the system prints an error message and exits with a non-zero code
