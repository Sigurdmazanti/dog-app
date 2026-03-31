## Context

The scraper pipeline extracts dog food nutritional composition from product pages, maps values through an AI-assisted extractor, and exports structured rows to Google Sheets. The data model (`NutritionData`) currently tracks macronutrients (protein, fat, fiber, crude ash, NFE, water) and energy (kiloJoule) but omits total sugar content. Sugar is a standard nutritional attribute present on many product pages and useful for dietary analysis.

The pipeline follows a well-established pattern for adding new composition fields: interface field → key map aliases → AI prompt annotation → Google Sheets column + resolver. This change touches four files in the scraper and adds no new dependencies.

## Goals / Non-Goals

**Goals:**
- Add `sugar` as a tracked field in the nutrition composition pipeline (interface → key map → AI prompt → Sheets export)
- Maintain column ordering convention in Google Sheets by inserting `item_sugar_g_per_100g` at a logical position among nutrition columns
- Provide Danish and English synonyms for alias-based matching

**Non-Goals:**
- Distinguishing sugar subtypes (glucose, fructose, sucrose) — only total sugar is tracked
- App-side (React Native) changes — this is scraper-only
- Changing existing column ordering or renaming existing columns

## Decisions

**1. Place `sugar` in `NutritionData` (not a new section)**
Sugar is a macronutrient breakdown (subset of carbohydrates/NFE), so it belongs alongside protein, fat, fiber, etc. in `NutritionData` rather than in a new composition group.
- *Alternative*: Create a separate `SugarsData` section — rejected because total sugar is a single field and fits the existing nutrition grouping.

**2. Insert `item_sugar_g_per_100g` after `item_water_g_per_100g` in the Sheets schema**
This places sugar with the other nutrition columns (protein, fat, fiber, NFE, crude ash, water) before minerals begin. The column is added at the end of the nutrition block.
- *Alternative*: Append column to the very end — rejected to keep logical grouping.

**3. Unit: `g/100g` for sugar**
Consistent with other macronutrient fields (protein, fat, fiber, NFE) which all use `g/100g`.

## Risks / Trade-offs

- **[Existing Sheets column shift]** → Inserting a column mid-schema shifts all subsequent column indices. Any external formulas referencing columns by position (not header) will break. Mitigation: The schema is defined as ordered names and the appender resolves by name, so this only affects external consumers reading by column index.
- **[AI extraction reliability]** → The AI model may not always extract sugar accurately from ambiguous text. Mitigation: Existing fallback-safe behavior applies — null/undefined values pass through as empty cells.
