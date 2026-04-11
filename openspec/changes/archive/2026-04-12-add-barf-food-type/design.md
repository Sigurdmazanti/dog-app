## Context

The scraper package (`scraper/`) defines a `FoodType` enum with five values: `dry`, `wet`, `treats`, `freeze-dried`, `misc`. This enum is the single source of truth for how products are categorised throughout the scraping pipeline — from CLI input validation, through YAML product grouping, to the water-amount mapping and Google Sheets output column.

BARF (Biologically Appropriate Raw Food) is a distinct raw feeding category that currently has no dedicated type. Products in this category would fall under `misc`, which loses meaningful categorisation. Adding `barf` requires touching all four layers consistently. The change is purely additive; no existing enum values are renamed or removed.

## Goals / Non-Goals

**Goals:**
- Add `Barf = "barf"` to the `FoodType` enum
- Map `barf` to a default water percentage of 0% in the water-amount mapper
- Accept `barf` as a valid `--food-type` CLI argument
- Add `barf:` as a valid product group key in all source YAML files (initialised to 0 / empty)

**Non-Goals:**
- Changing the default `--food-type` value (remains `dry`)
- Adding BARF-specific nutrition logic (e.g. protein-guaranteed minimums for raw food)
- Surfacing food types in the React Native app
- Any Supabase or Google Sheets schema changes

## Decisions

### 1. Default water percentage for `barf` → 0%

**Decision:** Map `FoodType.Barf` to `0` in `waterAmountMapper.ts`.

**Rationale:** The user requirement explicitly specifies water amount 0 for BARF. Although raw BARF products typically contain significant moisture (~70-80%), accurate moisture data must be read from the product page itself. Using `0` as the default follows the same pattern as `misc`, `treats`, and `freeze-dried`, signalling that no generic default can be assumed. Callers needing real moisture data must supply it explicitly from scraped content.

**Alternatives considered:**
- `75` (approximate raw food moisture) — would be an inaccurate default applied to all BARF products regardless of actual content; misleading in nutrition output.
- `null` / `undefined` — would require callers to handle an optional value where they currently assume a number; a breaking change.

### 2. No new CLI flag or dedicated code path for `barf`

**Decision:** `barf` is added to the existing `FoodType` enum and flows through the same pipeline as all other food types without special-casing.

**Rationale:** The scraper is already generic over `FoodType`; there is no food-type-specific branching beyond the water mapper. Adding `barf` as a plain enum member means it gets CLI validation, YAML loading, and Sheets output for free.

### 3. All source YAML files get `barf` key initialised to 0 / empty

**Decision:** Every `scraper/sources/*.yaml` file will have `barf: 0` added to `productCounts` and `barf: []` added to `products`.

**Rationale:** Consistent schema across all source files prevents runtime key-not-found issues if the YAML loader assumes all food type keys are present. Initialising to empty is a no-op for brands with no BARF products.

## Risks / Trade-offs

- **Spec drift** — Several existing specs explicitly enumerate valid `FoodType` values. Delta specs for `scraper-source-registry` and `scraper-cli-simplification` are required to keep specs accurate.
  → Mitigated by creating delta specs as part of this change.

- **Water amount 0 for BARF** — Unlike dry food (9%) or wet food (80%), raw BARF has significant moisture that is simply not defaulted here. Operators must ensure scraped water values are present.
  → Acceptable and intentional per the stated requirement. Behaviour matches `misc` and `treats`.
