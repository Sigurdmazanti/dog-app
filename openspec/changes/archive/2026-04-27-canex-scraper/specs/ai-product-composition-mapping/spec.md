## ADDED Requirements

### Requirement: AI mapper translates non-English ingredient descriptions
The AI mapper prompt SHALL instruct the model to return a translated English version of the ingredient description when the input text is in a non-English language. The translated text SHALL be returned in an `ingredientsDescriptionEnglish` field in the JSON response.

#### Scenario: Danish ingredient text is provided
- **WHEN** the composition text passed to the AI mapper contains Danish ingredient descriptions (e.g., "Tørret kylling (25%), ris (21%), majs, animalsk fedt")
- **THEN** the AI mapper SHALL return an `ingredientsDescriptionEnglish` field containing the English translation (e.g., "Dried chicken (25%), rice (21%), corn, animal fat")

#### Scenario: English ingredient text is provided
- **WHEN** the composition text passed to the AI mapper contains ingredient descriptions already in English
- **THEN** the AI mapper SHALL return the `ingredientsDescriptionEnglish` field containing the same text unchanged

#### Scenario: No ingredient text is identifiable in input
- **WHEN** the composition text contains only analytical values with no ingredient list
- **THEN** the AI mapper SHALL return `null` for the `ingredientsDescriptionEnglish` field

### Requirement: Translated ingredient field is optional for backward compatibility
The `ingredientsDescriptionEnglish` field in the AI mapper response SHALL be optional. Existing scrapers that do not use this field SHALL continue to function without modification.

#### Scenario: AI response includes translation field
- **WHEN** the AI mapper response includes `ingredientsDescriptionEnglish`
- **THEN** the `runScraper` function SHALL use this value to override the raw `ingredientsDescription` if present

#### Scenario: AI response omits translation field
- **WHEN** the AI mapper response does not include `ingredientsDescriptionEnglish` (older model response or English-only input)
- **THEN** the `runScraper` function SHALL use the original raw `ingredientsDescription` unchanged
