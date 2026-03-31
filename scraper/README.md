# Scraper Project

## Package Manager

- This folder uses npm.
- Use npm commands in this folder (`npm install`, `npm run build`, `npm run dev`).
- Do not use yarn in `scraper/`.

Monorepo note:
- `app/` uses Yarn and has its own `yarn.lock`.
- `scraper/` uses npm and has its own `package-lock.json`.

## Usage

### Single URL (simplest)

Scrape one product and auto-append to Google Sheets (food type defaults to `dry`):

```
npm run dev -- https://emea.acana.com/en/dogs/dog-food/eu-aca-grasslands.html
```

Override food type or skip sheets:

```
npm run dev -- https://example.com/product --food-type wet --no-sheets
```

### Batch from sitemap

Process all product URLs from a sitemap XML file (local or remote):

```
npm run dev -- --sitemap ./sitemap.xml
npm run dev -- --sitemap https://example.com/sitemap.xml
```

### Batch from URL list

Process URLs from a plain text or markdown file. Blank lines and `#` comments/headings are ignored. Markdown bullet lists (`- `, `* `), numbered lists (`1. `), and link syntax (`[text](url)`) are supported:

```
npm run dev -- --urls ./products.txt
npm run dev -- --urls ./products.md
```

Full example with all flags:

```
npm run dev -- --urls ./products.md --food-type wet --concurrency 5 --no-sheets
```

### Flags

| Flag | Default | Description |
|---|---|---|
| `--food-type <dry\|wet>` | `dry` | Food type for all URLs in the run |
| `--no-sheets` | _(sheets on)_ | Skip Google Sheets append |
| `--concurrency <n>` | `3` | Max concurrent scrapes in batch mode |
| `--sitemap <path-or-url>` | — | Sitemap XML input for batch mode |
| `--urls <file>` | — | URL list file input for batch mode |

Unrecognised URLs in batch mode are skipped (not errored). A progress line is printed per URL, and a summary is shown at the end.

## Dependencies
- axios
- cheerio
- xml2js
- csv-writer
- p-limit
- openai

## AI Mapping Configuration

The scraper can use AI-assisted composition mapping before exporting data. The mapper accepts raw composition text and sends it directly to the AI model.

Environment variables:
- `OPENAI_API_KEY`: Required to enable AI mapping.
- `OPENAI_MODEL`: Optional model override. Defaults to `gpt-5-nano`.
- `OPENAI_TIMEOUT_MS`: Optional timeout in milliseconds for each AI request. Defaults to `8000`.
- `OPENAI_MAX_RETRIES`: Optional retry count for failed AI requests. Defaults to `1`.

Behavior:
- Missing `OPENAI_API_KEY`: AI mapping is skipped and empty canonical sections are returned.
- Invalid JSON or schema mismatch from AI: response is rejected and empty canonical sections are returned.
- Timeout or API error: scraper logs a warning and continues with empty canonical sections.

## Google Sheets Export Contract

Results are appended to Google Sheets by default. Opt out with `--no-sheets`. Row serialization is driven by the canonical ordered schema in [src/helpers/googleSheetsAppender.ts](src/helpers/googleSheetsAppender.ts):

- The output order is fixed and chronological from `item_id` to `item_note`.
- Every append writes exactly the same number of cells as schema columns.
- Missing values are serialized as empty cells to preserve column alignment.
- Renamed canonical keys are handled in the appender mapping (for example `sulphur` -> `item_sulfur_mg_per_100g` and `fluorine` -> `item_fluoride_ug_per_100g`).

Representative sample row (object view before conversion to ordered array):

```json
{
	"item_id": "",
	"item_name": "Sample Product",
	"item_url": "https://example.com/item",
	"item_unit_weight_grams": 100,
	"item_food_type": "dryFood",
	"item_me_kj_per_100g": 1520,
	"item_protein_g_per_100g": 26,
	"item_fat_g_per_100g": 12,
	"item_fibers_g_per_100g": 3,
	"item_nfe_g_per_100g": 44,
	"item_crude_ash_g_per_100g": 7,
	"item_water_g_per_100g": 8,
	"item_salt_g_per_100g": 0.7,
	"item_calcium_mg_per_100g": 1600,
	"item_phosphorus_mg_per_100g": 1200,
	"item_sodium_mg_per_100g": 500,
	"item_magnesium_mg_per_100g": 120,
	"item_potassium_mg_per_100g": 750,
	"item_chlorine_mg_per_100g": 850,
	"item_sulfur_mg_per_100g": 280,
	"item_iron_mg_per_100g": 15,
	"item_copper_mg_per_100g": 1.7,
	"item_manganese_mg_per_100g": 2.2,
	"item_zinc_mg_per_100g": 14,
	"item_iodine_ug_per_100g": 180,
	"item_selenium_ug_per_100g": 35,
	"item_thiamine_mg_per_100g": 0.8,
	"item_riboflavin_mg_per_100g": 0.6,
	"item_niacin_mg_per_100g": 6,
	"item_pantothenic_acid_mg_per_100g": 1.8,
	"item_pyridoxine_mg_per_100g": 0.5,
	"item_biotin_ug_per_100g": 45,
	"item_folate_ug_per_100g": 70,
	"item_cobalamin_ug_per_100g": 4,
	"item_vitamin_c_mg_per_100g": 12,
	"item_vitamin_a_re_ug_per_100g": 1400,
	"item_vitamin_d_ug_per_100g": 16,
	"item_vitamin_d3_ug_per_100g": 16,
	"item_vitamin_d2_ug_per_100g": "",
	"item_25-hydroxy_vitamin_d3_ug_per_100g": "",
	"item_25-hydroxy_vitamin_d2_ug_per_100g": "",
	"item_vitamin_e_alfa-te_mg_per_100g": 10,
	"item_vitamin_k_ug_per_100g": 65,
	"item_vitamin_k1_ug_per_100g": 40,
	"item_vitamin_k2_ug_per_100g": 25,
	"item_sorbitol_g_per_100g": "",
	"item_ingredients_description": "Chicken meal, rice, beet pulp",
	"item_data_source": "",
	"item_note": "Sample note"
}
```

Install dependencies with:
```
npm install
```
