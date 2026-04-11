## Context

The scraper package (`scraper/`) defines a `FoodType` enum with four values: `dry`, `wet`, `treats`, `freeze-dried`. This enum is the single source of truth for how products are categorised throughout the scraping pipeline — from CLI input validation, through YAML product grouping, to the water-amount mapping and Google Sheets output column.

Adding `misc` requires touching all four layers consistently. The change is purely additive; no existing enum values are renamed or removed.

## Goals / Non-Goals

**Goals:**
- Add `Misc = "misc"` to the `FoodType` enum
- Map `misc` to a sensible default water percentage (0%) in the water-amount mapper
- Accept `misc` as a valid `--food-type` CLI argument
- Document `misc:` as a valid product group key in source YAML files

**Non-Goals:**
- Changing the default `--food-type` value (remains `dry`)
- Adding business logic specific to `misc` (e.g. special nutrition calculations)
- Surfacing food types in the React Native app
- Any Supabase or Google Sheets schema changes

## Decisions

### 1. Default water percentage for `misc` → 0%

**Decision:** Map `FoodType.Misc` to `0` in `waterAmountMapper.ts`.

**Rationale:** `misc` covers a heterogeneous catch-all category where moisture content is unknown. Using `0` matches the existing convention for `treats` and `freeze-dried`, which are also non-wet formats where no meaningful default can be assumed. Callers that need real moisture data must supply it explicitly.

**Alternatives considered:**
- `null` / `undefined` — would require callers to handle an optional value where they currently assume a number; a breaking change.
- `80` (wet default) — incorrect; `misc` products are not presumed wet.

### 2. No new CLI flag or dedicated code path for `misc`

**Decision:** `misc` is added to the existing `FoodType` enum and flows through the same pipeline as all other food types without special-casing.

**Rationale:** The scraper is already generic over `FoodType`; there is no food-type-specific branching beyond the water mapper. Adding `misc` as a plain enum member means it gets CLI validation, YAML loading, and Sheets output for free.

## Risks / Trade-offs

- **Spec drift** — Several existing specs explicitly enumerate valid `FoodType` values. Delta specs for `scraper-source-registry` and `scraper-cli-simplification` are required to keep specs accurate.
  → Mitigated by creating delta specs as part of this change.

- **YAML sources with `misc:` key** — Source files that need a `misc` product group must add the key manually; no migration tooling will backfill them.
  → Acceptable; `misc` is opt-in per source. Existing sources are unaffected.
