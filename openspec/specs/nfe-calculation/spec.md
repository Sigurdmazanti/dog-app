## Purpose

Define how NFE (Nitrogen-Free Extract) is calculated for dog food products.

## Requirements

### Requirement: NFE calculation
The scraper helper module SHALL expose a `calculateNFE` function that computes NFE (Nitrogen-Free Extract) as a percentage of a dog food product:

```
NFE = 100 − water − protein − fat − fibre − crudeAsh
```

The function SHALL accept a `NutritionData` object and return a number.

#### Scenario: All fields present
- **WHEN** `calculateNFE` is called with a fully populated `NutritionData` object (water=10, protein=25, fat=12, fiber=3, crudeAsh=6)
- **THEN** the function SHALL return `44` (i.e. 100 − 10 − 25 − 12 − 3 − 6)

### Requirement: NFE undefined-field handling
If any of `water`, `protein`, `fat`, `fiber`, or `crudeAsh` is `null` or `undefined`, `calculateNFE` SHALL return `0` immediately without performing the subtraction, so that the result is always a finite number and never `NaN`.

#### Scenario: One field is undefined
- **WHEN** `calculateNFE` is called with a `NutritionData` object where `crudeAsh` is `undefined`
- **THEN** the function SHALL return `0`

#### Scenario: Multiple fields are undefined
- **WHEN** `calculateNFE` is called with only `water` and `protein` defined and all other fields `undefined`
- **THEN** the function SHALL return `0`

#### Scenario: All fields undefined
- **WHEN** `calculateNFE` is called with a completely empty `NutritionData` object (all fields `undefined`)
- **THEN** the function SHALL return `0`
