## Purpose

Ensure the scraper package's TypeScript compiler options remain valid and non-deprecated across current and future TypeScript versions.

## Requirements

### Requirement: Scraper TypeScript compiler options are non-deprecated
The scraper package's `tsconfig.json` SHALL use non-deprecated TypeScript compiler options that will remain valid in TypeScript 7.0 and beyond.

#### Scenario: moduleResolution setting is not deprecated
- **WHEN** the scraper is compiled with `tsc`
- **THEN** no deprecation warning SHALL be emitted for `moduleResolution`

#### Scenario: module and moduleResolution are compatible
- **WHEN** `moduleResolution` is set to `"node16"`
- **THEN** `"module"` MUST also be set to `"node16"` (not `"commonjs"`) to satisfy TypeScript's compatibility rules

#### Scenario: TypeScript strict mode is preserved
- **WHEN** the updated tsconfig is applied
- **THEN** `"strict": true` SHALL remain enabled with no regressions in type checking
