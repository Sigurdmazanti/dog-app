## Purpose

Define how metabolizable energy is calculated for dog food products using the FEDIAF formula.

## Requirements

### Requirement: Metabolizable energy calculation
The scraper helper module SHALL expose a `calculateMetabolizableEnergy` function that computes ME (kJ per 100 g) for a dog food product using the FEDIAF formula:

```
ME = ((((23.8 × protein) + (39.3 × fat) + (17.1 × (NFE + fibre)))
       × (91.2 − (1.43 × fibre))) / 100)
     − (4.35 × protein)
```

where NFE is derived from `calculateNFE(data)`. The function SHALL accept a `NutritionData` object and return a rounded integer.

#### Scenario: Typical dry food product
- **WHEN** `calculateMetabolizableEnergy` is called with a valid `NutritionData` object representing a typical dry dog food (protein ~25%, fat ~12%, fibre ~3%, crudeAsh ~6%, water ~9%)
- **THEN** the function SHALL return a positive integer in the range 300–600 (kJ/100g)

#### Scenario: Zero-fibre product
- **WHEN** `calculateMetabolizableEnergy` is called with a product where fibre is 0
- **THEN** the digestibility correction factor resolves to `91.2 / 100 = 0.912` and the function SHALL still return a positive integer
