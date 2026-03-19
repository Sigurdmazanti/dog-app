## Column Coverage Checklist

This checklist maps each canonical Google Sheets column to how values are produced in the current implementation.

Legend:
- scraped: extracted from source data and mapped through key mappers
- derived: computed from existing values
- constant: static value
- intentionally blank: always empty by current agreed behavior

### Identity and metadata
- item_id: intentionally blank
- item_name: scraped
- item_url: scraped
- item_unit_weight_grams: constant
- item_food_type: derived (CLI input)
- item_data_source: intentionally blank
- item_note: derived (aggregated fallback and missing-field notes)

### Nutrition
- item_kj_per_100g: derived (metabolizable energy fallback when missing)
- item_protein_per_100g: scraped
- item_fat_per_100g: scraped
- item_fibers_per_100g: scraped
- item_nfe_per_100g: derived (calculated fallback when missing)
- item_crude_ash_per_100g: scraped
- item_water_per_100g: derived (defaulted by food type when missing)

### Minerals
- item_calcium_per_100g: scraped
- item_phosphorus_per_100g: scraped
- item_sodium_per_100g: scraped
- item_magnesium_per_100g: scraped
- item_potassium_per_100g: scraped
- item_chlorine_per_100g: scraped
- item_sulphur_per_100g: scraped
- item_cobalt_per_100g: scraped
- item_molybdenum_per_100g: scraped
- item_fluorine_per_100g: scraped
- item_silicon_per_100g: scraped
- item_chromium_per_100g: scraped
- item_vanadium_per_100g: scraped
- item_nickel_per_100g: scraped
- item_tin_per_100g: scraped
- item_arsenic_per_100g: scraped
- item_lead_per_100g: scraped
- item_cadmium_per_100g: scraped
- item_iron_per_100g: scraped
- item_copper_per_100g: scraped
- item_manganese_per_100g: scraped
- item_zinc_per_100g: scraped
- item_iodine_per_100g: scraped
- item_selenium_per_100g: scraped
- item_clinoptilolit_per_100g: scraped

### Vitamins
- item_thiamine_per_100g: scraped
- item_riboflavin_per_100g: scraped
- item_niacian_per_100g: scraped
- item_pantothenic_acid_per_100g: scraped
- item_pyridoxine_per_100g: scraped
- item_biotin_per_100g: scraped
- item_folate_per_100g: scraped
- item_cobalamin_per_100g: scraped
- item_vitamin_c_per_100g: scraped
- item_vitamin_a_per_100g: scraped
- item_vitamin_b_per_100g: scraped
- item_vitamin_d_per_100g: scraped
- item_vitamin_e_per_100g: scraped
- item_vitamin_k_per_100g: scraped

### Salts and additives
- item_salt_per_100g: scraped
- item_kaliumchlorid_per_100g: scraped
- item_ferrous_sulfate_per_100g: scraped
- item_copper_sulfate_per_100g: scraped
- item_pentanatriumtriphosphat_per_100g: scraped
- item_l_lysin_per_100g: scraped
- item_taurin_per_100g: scraped
- item_l_carnitin_per_100g: scraped
- item_choline_per_100g: scraped
- item_omega_3_per_100g: scraped
- item_omega_6_per_100g: scraped
- item_glycerin_per_100g: scraped

### Free text
- item_ingredients_description: scraped
