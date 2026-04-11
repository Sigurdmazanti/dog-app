## MODIFIED Requirements

### Requirement: Invalid food type rejected
The system MUST reject unrecognised `--food-type` values and print an error listing all valid food types.

#### Scenario: Invalid food type rejected
- **WHEN** the CLI is invoked with `--food-type invalid`
- **THEN** the system prints an error listing valid food types (`dry`, `wet`, `treats`, `freeze-dried`, `misc`, `barf`) and exits with a non-zero code

## ADDED Requirements

### Requirement: barf is accepted as a valid food type argument
The CLI MUST accept `barf` as a valid `--food-type` value.

#### Scenario: barf food type argument accepted
- **WHEN** the CLI is invoked with `--food-type barf`
- **THEN** the system accepts it as a valid food type and begins scraping with food type `barf`
