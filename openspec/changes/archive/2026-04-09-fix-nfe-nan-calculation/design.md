## Context

`calculateNFE` in `scraper/src/helpers/nutritionCalculator.ts` computes:

```
NFE = 100 - water - protein - fat - fiber - crudeAsh
```

The `NutritionData` interface declares all fields as `number`, but scrapers populate these fields from raw HTML and can leave them `undefined` when a value is absent from the product page. TypeScript does not catch this at runtime because the scrapers return `Partial`-like objects that are cast to the full interface. Any `undefined` operand in the subtraction silently produces `NaN`, which propagates into the note text and the ME calculation.

## Goals / Non-Goals

**Goals:**
- `calculateNFE` returns a valid number even when one or more nutrition fields are missing (treating missing as `0`).
- `calculateMetabolizableEnergy` is consistent — it also guards its own direct field accesses.
- Note text always renders a real percentage, e.g. `"Udregnet til 12%"`.

**Non-Goals:**
- Changing the `NutritionData` interface to use optional types (would ripple through the whole codebase).
- Validating or warning when a field is missing — that is already handled by `checkMissingFields`.
- Changing the NFE formula itself.

## Decisions

### Decision: Nullish coalescing at the point of calculation, not at the interface boundary

`NutritionData` fields are typed `number` (not `number | undefined`). Rather than changing the interface to `number | undefined` everywhere, apply `?? 0` (nullish coalescing) inside `calculateNFE` and `calculateMetabolizableEnergy` at each field read.

**Alternatives considered:**
- **Widen the interface to `number | undefined`** — Would require changes to every scraper, mapper, and Google Sheets appender. Too broad for a targeted bug fix.
- **Guard only in `scraper.ts` before calling calculateNFE** — The functions would still be silently broken when called from other contexts. Better to make the helpers intrinsically safe.

### Decision: Treat missing components as `0`

A missing nutrition component most likely means the scraper couldn't find it, not that it is truly zero. However, using `0` is the only mathematically sound default that keeps the NFE formula internally consistent (components must sum to 100). The existing `checkMissingFields` call in `scraper.ts` already flags missing fields in the notes, so the user is informed.

## Risks / Trade-offs

- **Risk: NFE could be artificially high** if several fields are missing (e.g. no ash → NFE is inflated by that amount) → Mitigation: `checkMissingFields` already emits a note for each absent field; no additional action needed here.
- **Risk: ME could still be inaccurate** if core fields like protein/fat are missing → Mitigation: same — already flagged by missing-fields check. The fix only stops `NaN` propagation; data quality warnings are a separate concern.
