## ADDED Requirements

### Requirement: Key map SHALL resolve Swedish fat label to canonical fat field
The `nutritionKeyMap.fat` alias array MUST include the Swedish label `fett`.

#### Scenario: Swedish fat label matched
- **WHEN** an analysis row label normalises to `fett`
- **THEN** it resolves to the `fat` canonical field

### Requirement: Key map SHALL resolve Swedish ash label to canonical crudeAsh field
The `nutritionKeyMap.crudeAsh` alias array MUST include the Swedish label `aska`.

#### Scenario: Swedish ash label matched
- **WHEN** an analysis row label normalises to `aska`
- **THEN** it resolves to the `crudeAsh` canonical field

### Requirement: Key map SHALL resolve Swedish crude fibre label to canonical fiber field
The `nutritionKeyMap.fiber` alias array MUST include the Swedish label `växttråd`.

#### Scenario: Swedish crude fibre label matched
- **WHEN** an analysis row label normalises to `växttråd`
- **THEN** it resolves to the `fiber` canonical field

### Requirement: Key map SHALL resolve Swedish iron label to canonical iron field
The `mineralsKeyMap.iron` alias array MUST include the Swedish label `järn`.

#### Scenario: Swedish iron label matched
- **WHEN** an analysis row label normalises to `järn`
- **THEN** it resolves to the `iron` canonical field

### Requirement: Key map SHALL resolve Swedish omega-3 label to canonical omega3 field
The `fattyAcidsKeyMap.omega3` alias array MUST include `omega-3 fettsyror` and `omega 3 fettsyror`.

#### Scenario: Swedish omega-3 label with hyphen matched
- **WHEN** an analysis row label normalises to `omega-3 fettsyror`
- **THEN** it resolves to the `omega3` canonical field

#### Scenario: Swedish omega-3 label with space matched
- **WHEN** an analysis row label normalises to `omega 3 fettsyror`
- **THEN** it resolves to the `omega3` canonical field
