## MODIFIED Requirements

### Requirement: Expanded composition model coverage
The scraper domain model MUST define typed fields for the requested composition groups: minerals, salts, vitamins (including B1/B2/B3/B5/B6/B7/B9/B12), amino-acid derivatives, vitamin-like compounds, fatty acids, sugar alcohols, and total sugar within the nutrition group. `ScrapeDataRow` MUST also carry a `brand: string` field sourced from the matched `SourceEntry`.

#### Scenario: Typed groups are present in contracts
- **WHEN** developers inspect product composition and scrape result interfaces
- **THEN** each requested group and field has an explicit typed property available for parsing and export

#### Scenario: Sugar field is present in NutritionData
- **WHEN** developers inspect the `NutritionData` interface
- **THEN** a `sugar` field of type `number` is available alongside existing macronutrient fields

#### Scenario: Brand field is present in ScrapeDataRow
- **WHEN** developers inspect the `ScrapeDataRow` interface
- **THEN** a `brand` field of type `string` is present alongside `dataSource` and other enrichment fields
