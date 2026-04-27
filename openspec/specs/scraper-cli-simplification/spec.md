## Purpose

Define the scraper CLI's simplified defaults and flag interface for single-URL and batch invocation modes.

## Requirements

### Requirement: Google Sheets append is on by default
The system MUST append scrape results to Google Sheets by default, without requiring an explicit flag.

#### Scenario: Default invocation appends to sheets
- **WHEN** the CLI is invoked with a URL and no sheets-related flags
- **THEN** the scrape result is appended to Google Sheets

#### Scenario: Opt-out with no-sheets flag
- **WHEN** the CLI is invoked with `--no-sheets`
- **THEN** the scrape result is NOT appended to Google Sheets

#### Scenario: Missing sheets config with default on
- **WHEN** Google Sheets env vars are not set and `--no-sheets` is not passed
- **THEN** the system prints a warning about missing configuration and skips the sheets append without failing the scrape

### Requirement: Food type defaults to dry
The system MUST default the food type to `dry` when not explicitly provided, except when using a YAML source file via `--urls` where the food type SHALL be inferred from the YAML structure if `--food-type` is omitted.

#### Scenario: No food type argument in single-URL mode
- **WHEN** the CLI is invoked with only a URL (no food type argument)
- **THEN** the system uses `dry` as the food type

#### Scenario: No food type argument with YAML source file
- **WHEN** the CLI is invoked with `--urls sources/brand.yaml` and no `--food-type` flag
- **THEN** the system loads all food-type categories from the YAML and pairs each URL with its category's food type

#### Scenario: Explicit food type override
- **WHEN** the CLI is invoked with `--food-type wet`
- **THEN** the system uses `wet` as the food type

#### Scenario: Explicit food type with YAML source file
- **WHEN** the CLI is invoked with `--urls sources/brand.yaml --food-type dry`
- **THEN** the system loads only `products.dry` URLs and processes them with `foodType: 'dry'`

#### Scenario: Invalid food type rejected
- **WHEN** the CLI is invoked with `--food-type invalid`
- **THEN** the system prints an error listing valid food types (`dry`, `wet`, `treats`, `freeze-dried`, `misc`, `barf`) and exits with a non-zero code

#### Scenario: No food type argument with non-YAML URL list
- **WHEN** the CLI is invoked with `--urls products.txt` and no `--food-type` flag
- **THEN** the system defaults to `dry` as the food type

### Requirement: Single-URL backward compatibility
The system MUST continue to accept a bare URL as the first positional argument for single-URL scraping.

#### Scenario: Bare URL invocation
- **WHEN** the CLI is invoked with `npm run dev -- https://example.com/product`
- **THEN** the system scrapes that single URL using default food type and default sheets append

#### Scenario: Bare URL with all flags
- **WHEN** the CLI is invoked with `npm run dev -- https://example.com/product --food-type wet --no-sheets`
- **THEN** the system scrapes that single URL with food type `wet` and no sheets append

### Requirement: barf is accepted as a valid food type argument
The CLI MUST accept `barf` as a valid `--food-type` value.

#### Scenario: barf food type argument accepted
- **WHEN** the CLI is invoked with `--food-type barf`
- **THEN** the system accepts it as a valid food type and begins scraping with food type `barf`

### Requirement: misc is accepted as a valid food type argument
The CLI MUST accept `misc` as a valid `--food-type` value.

#### Scenario: misc food type argument accepted
- **WHEN** the CLI is invoked with `--food-type misc`
- **THEN** the system accepts it as a valid food type and begins scraping with food type `misc`
