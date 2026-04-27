## MODIFIED Requirements

### Requirement: Batch processing from URL list file
The system MUST accept a `--urls <path>` flag. When the path points to a `.yaml` or `.yml` file, it SHALL be treated as a brand source file. If `--food-type` is provided, only URLs for that food type SHALL be loaded from the `products.<food-type>` key. If `--food-type` is omitted, URLs from ALL food-type keys in the `products` map SHALL be loaded, each paired with its corresponding food type. When the path points to any other file type, the existing plain-text/markdown URL list behaviour is preserved. Markdown list prefixes (`- `, `* `, `1. `), markdown link syntax (`[text](url)`), headings, and blank lines MUST be handled transparently for non-YAML files.

#### Scenario: YAML source file processed with food type filter
- **WHEN** the CLI is invoked with `--urls sources/acana-eu.yaml --food-type dry`
- **THEN** the system loads only the URLs under `products.dry` in that file and processes them with `foodType: 'dry'`

#### Scenario: YAML source file processed without food type filter
- **WHEN** the CLI is invoked with `--urls sources/acana-eu.yaml` and no `--food-type` flag
- **THEN** the system loads URLs from all non-empty food-type keys in the YAML and processes each URL with its corresponding food type

#### Scenario: YAML source file with no entries for food type produces empty batch
- **WHEN** the CLI is invoked with `--urls sources/acana-eu.yaml --food-type treats` and the file has an empty `treats` list
- **THEN** the system prints a warning that no URLs were found and exits without error

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
