## MODIFIED Requirements

### Requirement: Invalid food type rejected
The system MUST reject unrecognised `--food-type` values and print an error listing all valid food types.

#### Scenario: Invalid food type rejected
- **WHEN** the CLI is invoked with `--food-type invalid`
- **THEN** the system prints an error listing valid food types (`dry`, `wet`, `treats`, `freeze-dried`, `misc`) and exits with a non-zero code

## ADDED Requirements

### Requirement: misc is accepted as a valid food type argument
The CLI MUST accept `misc` as a valid `--food-type` value.

#### Scenario: misc food type argument accepted
- **WHEN** the CLI is invoked with `--food-type misc`
- **THEN** the system accepts it as a valid food type and begins scraping with food type `misc`
