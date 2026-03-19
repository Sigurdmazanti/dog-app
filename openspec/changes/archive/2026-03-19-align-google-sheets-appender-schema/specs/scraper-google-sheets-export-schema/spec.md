## ADDED Requirements

### Requirement: Canonical Google Sheets column order
The scraper export pipeline MUST define a single canonical ordered list of Google Sheets columns and SHALL build every appended row by iterating that list in order. The canonical list MUST match the sheet header contract exactly, including the exact `item_*` field names.

#### Scenario: Ordered append row generation
- **WHEN** the appender prepares a row for a scraped product
- **THEN** the row values SHALL be produced in the exact canonical column order with no positional reordering

#### Scenario: Header naming contract
- **WHEN** a column exists in the canonical schema
- **THEN** the export key name MUST match the expected sheet column name exactly, including prefix and spelling

### Requirement: Extended mineral coverage and naming
The canonical schema MUST include the following new mineral columns using this naming convention: `item_<english_name>_per_100g`.

New columns:
- `item_cobalt_per_100g`
- `item_molybdenum_per_100g`
- `item_fluorine_per_100g`
- `item_silicon_per_100g`
- `item_chromium_per_100g`
- `item_vanadium_per_100g`
- `item_nickel_per_100g`
- `item_tin_per_100g`
- `item_arsenic_per_100g`
- `item_lead_per_100g`
- `item_cadmium_per_100g`

#### Scenario: New mineral aliases are mapped
- **WHEN** source labels include aliases for cobalt, molybdenum, fluorine, silicon, chromium, vanadium, nickel, tin, arsenic, lead, or cadmium
- **THEN** the scraper MUST map them to their canonical mineral fields and export to the matching `item_*_per_100g` columns

#### Scenario: Missing new mineral values
- **WHEN** a new mineral value is absent from source data
- **THEN** the export pipeline SHALL place an explicit empty value in that mineral column while preserving row alignment

### Requirement: Row schema validation before append
Before appending to Google Sheets, the appender MUST validate that generated rows conform to the canonical schema width and mapping constraints.

#### Scenario: Row width mismatch
- **WHEN** a generated row contains fewer or more values than the canonical schema length
- **THEN** the appender MUST fail the operation and return a descriptive schema mismatch error

#### Scenario: Unmapped required identity fields
- **WHEN** one of `item_id`, `item_name`, or `item_data_source` cannot be mapped for a row
- **THEN** the appender MUST fail the append for that row and surface which required fields are missing

### Requirement: Explicit optional-field handling
The export pipeline MUST classify columns as required or optional and SHALL use explicit empty defaults for optional columns that are unavailable from source data.

#### Scenario: Optional nutrient unavailable from source
- **WHEN** a nutrient column is optional and source scraping does not provide a value
- **THEN** the appender SHALL emit an explicit empty value in the correct column position

#### Scenario: Optional field with derived value
- **WHEN** a derived value is available for an optional column
- **THEN** the appender SHALL write the derived value in the column’s canonical position

### Requirement: Canonical Google Sheets order for insertion
The change MUST publish a complete canonical column order for Google Sheets insertion. The order SHALL be:

1. `item_id`
2. `item_name`
3. `item_url`
4. `item_unit_weight_grams`
5. `item_food_type`
6. `item_kj_per_100g`
7. `item_protein_per_100g`
8. `item_fat_per_100g`
9. `item_fibers_per_100g`
10. `item_nfe_per_100g`
11. `item_crude_ash_per_100g`
12. `item_water_per_100g`
13. `item_calcium_per_100g`
14. `item_phosphorus_per_100g`
15. `item_sodium_per_100g`
16. `item_magnesium_per_100g`
17. `item_potassium_per_100g`
18. `item_chlorine_per_100g`
19. `item_sulphur_per_100g`
20. `item_cobalt_per_100g`
21. `item_molybdenum_per_100g`
22. `item_fluorine_per_100g`
23. `item_silicon_per_100g`
24. `item_chromium_per_100g`
25. `item_vanadium_per_100g`
26. `item_nickel_per_100g`
27. `item_tin_per_100g`
28. `item_arsenic_per_100g`
29. `item_lead_per_100g`
30. `item_cadmium_per_100g`
31. `item_iron_per_100g`
32. `item_copper_per_100g`
33. `item_manganese_per_100g`
34. `item_zinc_per_100g`
35. `item_iodine_per_100g`
36. `item_selenium_per_100g`
37. `item_thiamine_per_100g`
38. `item_riboflavin_per_100g`
39. `item_niacian_per_100g`
40. `item_pantothenic_acid_per_100g`
41. `item_pyridoxine_per_100g`
42. `item_biotin_per_100g`
43. `item_folate_per_100g`
44. `item_cobalamin_per_100g`
45. `item_vitamin_c_per_100g`
46. `item_vitamin_a_per_100g`
47. `item_vitamin_b_per_100g`
48. `item_vitamin_d_per_100g`
49. `item_vitamin_e_per_100g`
50. `item_vitamin_k_per_100g`
51. `item_clinoptilolit_per_100g`
52. `item_salt_per_100g`
53. `item_kaliumchlorid_per_100g`
54. `item_ferrous_sulfate_per_100g`
55. `item_copper_sulfate_per_100g`
56. `item_pentanatriumtriphosphat_per_100g`
57. `item_l_lysin_per_100g`
58. `item_taurin_per_100g`
59. `item_l_carnitin_per_100g`
60. `item_choline_per_100g`
61. `item_omega_3_per_100g`
62. `item_omega_6_per_100g`
63. `item_glycerin_per_100g`
64. `item_ingredients_description`
65. `item_data_source`
66. `item_note`

#### Scenario: Sheet header insertion readiness
- **WHEN** maintainers copy the canonical list into Google Sheets header row
- **THEN** every exported row SHALL align one-to-one with the 66-column order without manual remapping

### Requirement: Model and mapper expansion for new columns
For each added canonical column, the scraper domain model and key mapper configuration MUST be extended so the extractor can reuse existing alias matching and numeric fallback behavior.

#### Scenario: Interface and key mapper parity
- **WHEN** a new column is introduced in the canonical schema
- **THEN** corresponding model fields and key mapper aliases MUST be added before appender updates are considered complete

#### Scenario: Reused parsing logic for new fields
- **WHEN** the scraper parses constituent rows
- **THEN** new fields SHALL be populated via the existing key-map driven matching flow, not by isolated one-off parsing branches
