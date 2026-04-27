## Context

The scraper project has an established pattern for adding new brand scrapers: a source YAML, a scraper TypeScript file using `runScraper` with three extractors, a selector reference, and a source registry entry. The Canex site (canex-shop.dk) uses WooCommerce with accordion-based product details in Danish. The AI composition mapper already handles numeric extraction well regardless of language, and the `productCompositionKeyMap.ts` already includes Danish aliases for most nutritional terms. The main challenge is that `ingredientsDescription` is returned as raw text — currently untranslated.

## Goals / Non-Goals

**Goals:**
- Scrape all 44 Canex products (20 dry, 24 treats) using the standard `runScraper` pattern.
- Ensure the AI mapper correctly processes Danish analytical composition text (it already should, given existing Danish key aliases).
- Translate the Danish `ingredientsDescription` to English so stored data is consistent with other scrapers.

**Non-Goals:**
- Adding new packages or dependencies.
- Changing the `runScraper` interface or core scraper architecture.
- Scraping additional metadata (images, pricing, dosage tables).
- Supporting other languages beyond Danish for this change.

## Decisions

### 1. Ingredient Translation via AI Mapper Prompt

**Decision**: Extend the `createPrompt` function in `aiProductCompositionMapper.ts` to instruct the AI to also return a translated `ingredientsDescription` field in its JSON response. The scraper will pass the raw Danish ingredient text as part of the composition text, and the AI will return both the mapped nutritional values and the English-translated ingredient list.

**Rationale**: The AI call is already made for every product. Adding a translation instruction to the same prompt avoids a second API call, keeps latency the same, and leverages GPT's strong multilingual capabilities. The alternative — a separate translation API call — would double the OpenAI cost per product and add complexity.

**Alternatives considered**:
- Separate OpenAI translation call: Higher cost, more latency, more code.
- Local translation dictionary: Too brittle for free-form ingredient text with varying phrasing.
- Return Danish as-is: Inconsistent with other scrapers' English-only data.

### 2. Selector Strategy for Accordion-Based Layout

**Decision**: Extract composition data from the accordion sections using `#accordion-*-content` containers. The "Sammensætning" (Composition) accordion contains the ingredient list as paragraph text and analytical values in a `<table>`. The title comes from `h1.product-title`.

**Rationale**: The accordion structure is consistent across all product pages. The composition text and table are inside a single accordion item, making extraction straightforward with Cheerio.

### 3. Treat Products with Short Descriptions Only

**Decision**: For treat products that lack the full accordion detail section, fall back to extracting composition data from `.product-short-description`. Some treats only have a short description with inline "Analyse:" values rather than a full table.

**Rationale**: The example markup shows treats may have composition info in the short description area. The scraper should handle both formats gracefully.

## Risks / Trade-offs

- **[Danish text variations]** → The AI mapper is robust to language variation, and key maps already cover Danish terms. Low risk.
- **[AI translation quality]** → GPT handles Danish-to-English ingredient translation well. Minor risk of brand-specific terms being mistranslated. Mitigation: review first batch output.
- **[Accordion structure changes]** → If Canex redesigns their WooCommerce theme, selectors break. Mitigation: standard risk for all scrapers; selector reference documents the structure.
- **[AI mapper prompt change affects other scrapers]** → Adding translation instructions must be backward-compatible. Mitigation: make the translation field optional in the response — only use it when present, fall back to raw text otherwise.
