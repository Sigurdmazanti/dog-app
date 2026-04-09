## 1. nutritionCalculator.ts — NFE fix

- [x] 1.1 In `calculateNFE`, replace each bare field reference with `?? 0` (e.g. `(data.water ?? 0)`) for all five components: `water`, `protein`, `fat`, `fiber`, `crudeAsh`
- [x] 1.2 In `calculateMetabolizableEnergy`, apply `?? 0` to every direct field access
- [x] 1.3 Verify TypeScript compiles without errors: `cd scraper ; yarn tsc --noEmit`

## 2. Smoke test

- [x] 2.1 Run a wet-food scrape with a product known to have a missing nutrition field and confirm the note shows a numeric percentage instead of `NaN%`
