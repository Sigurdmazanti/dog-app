## 1. nutritionCalculator.ts

- [x] 1.1 Replace `calculateGrossEnergy` with `calculateMetabolizableEnergy` using the FEDIAF ME formula
- [x] 1.2 Add a JSDoc comment to `calculateMetabolizableEnergy` explaining the formula, its components, and its source
- [x] 1.3 Verify the old `calculateGrossEnergy` export is fully removed

## 2. scraper.ts

- [x] 2.1 Update the import statement to use `calculateMetabolizableEnergy` instead of `calculateGrossEnergy`
- [x] 2.2 Update the call-site where `kiloJouleAmount` is assigned to call `calculateMetabolizableEnergy`
- [x] 2.3 Verify no other references to `calculateGrossEnergy` remain anywhere in the scraper package
