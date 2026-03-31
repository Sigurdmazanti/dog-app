## Why

The scraper's composition data pipeline currently tracks macronutrients, minerals, vitamins, and sugar alcohols — but does not capture total sugar content. Adding `sugar` as a tracked nutrition field enables more complete nutritional profiles for dog food products exported to Google Sheets.

## What Changes

- Add a `sugar` field to `NutritionData` interface and the `nutritionKeyMap` with Danish/English synonyms (e.g. "sugar", "sukker", "sugars", "sukkerarter")
- Include `sugar` in the AI composition mapper prompt with `g/100g` unit annotation so the OpenAI model extracts it from raw text
- Add the `item_sugar_g_per_100g` column to the Google Sheets schema and wire its column resolver to the new field

## Capabilities

### New Capabilities

_(none — this change extends existing capabilities)_

### Modified Capabilities

- `scraped-product-composition-export`: The `NutritionData` model gains a `sugar` field and the key map gains corresponding aliases
- `google-sheets-column-schema-alignment`: The `GOOGLE_SHEETS_SCHEMA` gains the `item_sugar_g_per_100g` column and a corresponding resolver
- `ai-product-composition-mapping`: The AI prompt schema template and `CANONICAL_FIELD_UNITS` gain the `sugar` field with `g/100g` unit

## Impact

- **scraper/src/interfaces/productComposition.ts** — new `sugar: number` field in `NutritionData`
- **scraper/src/helpers/productCompositionKeyMap.ts** — new `sugar` entry in `nutritionKeyMap`
- **scraper/src/helpers/aiProductCompositionMapper.ts** — new `sugar` entry in `CANONICAL_FIELD_UNITS`
- **scraper/src/helpers/googleSheetsAppender.ts** — new column in `GOOGLE_SHEETS_SCHEMA` and resolver in `createColumnResolvers`
- No app-side (React Native) changes required; this is scraper-only
- No new EAS build needed; hot-reload only for the scraper
