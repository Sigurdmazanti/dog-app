## Context

The scraper's `nutritionCalculator.ts` currently exports `calculateGrossEnergy`, which computes a simplified energy estimate using fixed combustion coefficients. This does not model digestive or urinary energy losses, making the value unsuitable for pet-food nutritional comparison or labelling.

The change is isolated to the `scraper/` package — a standalone Node/TypeScript tool with no shared code reaching the mobile app. The output field name (`kiloJouleAmount`) in `scraper.ts` is kept as-is; only the calculated value and function name change.

## Goals / Non-Goals

**Goals:**
- Replace `calculateGrossEnergy` with `calculateMetabolizableEnergy` using the FEDIAF ME formula
- Rename every import and call-site in the scraper package to match
- Remove the old export so callers cannot accidentally use the stale formula

**Non-Goals:**
- No changes to the Supabase schema or stored field names
- No changes to any mobile app code
- No back-filling or migration of previously scraped records

## Decisions

### Keep the same function signature

`(data: NutritionData): number` is unchanged. The caller in `scraper.ts` assigns the return value directly to `kiloJouleAmount`, so keeping the return type `number` (kJ/100g, rounded) avoids any further refactoring.

**Alternative considered:** Return a richer object with intermediate values (NFE, raw ME). Rejected — over-engineering for a scraper with a single call-site.

### Reuse `calculateNFE` helper

The ME formula depends on NFE (100 − water − protein − fat − fibre − crudeAsh). `calculateNFE` already computes this correctly. There is no reason to inline it.

### Formula used

```
ME(kJ/100g) =
  ((((23.8 × protein) + (39.3 × fat) + (17.1 × (NFE + fibre)))
    × (91.2 − (1.43 × fibre))) / 100)
  − (4.35 × protein)
```

Source: FEDIAF (European Pet Food Industry Federation) nutritional guidelines for complete pet food. This formula incorporates:
- Modified Atwater coefficients adjusted for typical pet food digestibility
- A digestibility correction factor `(91.2 − 1.43 × %fibre) / 100`
- A urinary energy loss term `4.35 × %protein` to account for urea excretion

**Alternative considered:** NRC (2006) factorial ME. More accurate for clinical use but requires additional input data not scraped. Rejected for now.

## Risks / Trade-offs

- **Values will change for the same product** → New scrape runs will produce different `kiloJouleAmount` values than earlier runs. Any comparison between old and new scraped records must account for this formula change. No mitigation is applied (out of scope), but the commit timestamp makes the boundary clear.

- **NFE can go negative for poorly-labelled products** → If a product's declared nutrient percentages sum to more than 100, NFE becomes negative. The ME formula does not guard against this. Mitigation: this was already a risk with the old formula; no regression introduced.

## Migration Plan

1. Replace function in `nutritionCalculator.ts`, add comprehensive JSDoc comment
2. Update import and call-site in `scraper.ts`
3. Run a manual test scrape to verify output is reasonable (typically 300–600 kJ/100g for dry dog food)
4. No rollback strategy needed — git revert is sufficient if the formula must be reverted
