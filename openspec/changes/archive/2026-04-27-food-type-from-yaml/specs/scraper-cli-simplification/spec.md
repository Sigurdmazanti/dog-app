## MODIFIED Requirements

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
