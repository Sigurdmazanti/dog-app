import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { ScrapeDataRow } from '../interfaces/scrapeResult';
import * as path from 'path';
import * as fs from 'fs';

interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  credentialsPath: string;
}

type ColumnValue = string | number;
export const GOOGLE_SHEETS_SCHEMA = [
  'item_id',
  'item_name',
  'item_url',
  'item_unit_weight_grams',
  'item_food_type',
  'item_kj_per_100g',
  'item_protein_per_100g',
  'item_fat_per_100g',
  'item_fibers_per_100g',
  'item_nfe_per_100g',
  'item_crude_ash_per_100g',
  'item_water_per_100g',
  'item_calcium_per_100g',
  'item_phosphorus_per_100g',
  'item_sodium_per_100g',
  'item_magnesium_per_100g',
  'item_potassium_per_100g',
  'item_chlorine_per_100g',
  'item_sulphur_per_100g',
  'item_cobalt_per_100g',
  'item_molybdenum_per_100g',
  'item_fluorine_per_100g',
  'item_silicon_per_100g',
  'item_chromium_per_100g',
  'item_vanadium_per_100g',
  'item_nickel_per_100g',
  'item_tin_per_100g',
  'item_arsenic_per_100g',
  'item_lead_per_100g',
  'item_cadmium_per_100g',
  'item_iron_per_100g',
  'item_copper_per_100g',
  'item_manganese_per_100g',
  'item_zinc_per_100g',
  'item_iodine_per_100g',
  'item_selenium_per_100g',
  'item_thiamine_per_100g',
  'item_riboflavin_per_100g',
  'item_niacian_per_100g',
  'item_pantothenic_acid_per_100g',
  'item_pyridoxine_per_100g',
  'item_biotin_per_100g',
  'item_folate_per_100g',
  'item_cobalamin_per_100g',
  'item_vitamin_c_per_100g',
  'item_vitamin_a_per_100g',
  'item_vitamin_b_per_100g',
  'item_vitamin_d_per_100g',
  'item_vitamin_e_per_100g',
  'item_vitamin_k_per_100g',
  'item_clinoptilolit_per_100g',
  'item_salt_per_100g',
  'item_kaliumchlorid_per_100g',
  'item_ferrous_sulfate_per_100g',
  'item_copper_sulfate_per_100g',
  'item_pentanatriumtriphosphat_per_100g',
  'item_l_lysin_per_100g',
  'item_taurin_per_100g',
  'item_l_carnitin_per_100g',
  'item_choline_per_100g',
  'item_omega_3_per_100g',
  'item_omega_6_per_100g',
  'item_glycerin_per_100g',
  'item_ingredients_description',
  'item_data_source',
  'item_note',
] as const;

export const EXPECTED_GOOGLE_SHEETS_COLUMN_COUNT = GOOGLE_SHEETS_SCHEMA.length;

function validateSchemaContract(schema: readonly string[]): void {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const column of schema) {
    if (seen.has(column)) {
      duplicates.push(column);
    }
    seen.add(column);
  }

  if (duplicates.length > 0) {
    throw new Error(`Google Sheets schema contains duplicate columns: ${duplicates.join(', ')}`);
  }
}

export function buildGoogleSheetsRow(dataRow: ScrapeDataRow): ColumnValue[] {
  const row: ColumnValue[] = [
    '', // item_id intentionally left empty
    dataRow.title,
    dataRow.url,
    100,
    dataRow.foodType,
    dataRow.nutritionData.kiloJoule,
    dataRow.nutritionData.protein,
    dataRow.nutritionData.fat,
    dataRow.nutritionData.fiber,
    dataRow.nutritionData.nfe,
    dataRow.nutritionData.crudeAsh,
    dataRow.nutritionData.water,
    dataRow.mineralsData.calcium,
    dataRow.mineralsData.phosphorus,
    dataRow.mineralsData.sodium,
    dataRow.mineralsData.magnesium,
    dataRow.mineralsData.potassium,
    dataRow.mineralsData.chlorine,
    dataRow.mineralsData.sulphur,
    dataRow.mineralsData.cobalt,
    dataRow.mineralsData.molybdenum,
    dataRow.mineralsData.fluorine,
    dataRow.mineralsData.silicon,
    dataRow.mineralsData.chromium,
    dataRow.mineralsData.vanadium,
    dataRow.mineralsData.nickel,
    dataRow.mineralsData.tin,
    dataRow.mineralsData.arsenic,
    dataRow.mineralsData.lead,
    dataRow.mineralsData.cadmium,
    dataRow.mineralsData.iron,
    dataRow.mineralsData.copper,
    dataRow.mineralsData.manganese,
    dataRow.mineralsData.zinc,
    dataRow.mineralsData.iodine,
    dataRow.mineralsData.selenium,
    dataRow.vitaminsData.b1,
    dataRow.vitaminsData.b2,
    dataRow.vitaminsData.b3,
    dataRow.vitaminsData.b5,
    dataRow.vitaminsData.b6,
    dataRow.vitaminsData.b7,
    dataRow.vitaminsData.b9,
    dataRow.vitaminsData.b12,
    dataRow.vitaminsData.cVitamin,
    dataRow.vitaminsData.aVitamin,
    dataRow.vitaminsData.bVitamin,
    dataRow.vitaminsData.dVitamin,
    dataRow.vitaminsData.eVitamin,
    dataRow.vitaminsData.kVitamin,
    dataRow.mineralsData.clinoptilolite,
    dataRow.saltsData.sodiumChloride,
    dataRow.saltsData.potassiumChloride,
    dataRow.saltsData.ferrousSulfate,
    dataRow.saltsData.copperSulfate,
    dataRow.saltsData.pentasodiumTriphosphate,
    dataRow.aminoAcidsData.lLysine,
    dataRow.aminoAcidsData.taurine,
    dataRow.vitaminLikeData.lCarnitine,
    dataRow.vitaminLikeData.choline,
    dataRow.fattyAcidsData.omega3,
    dataRow.fattyAcidsData.omega6,
    dataRow.sugarAlcoholsData.glycerin,
    dataRow.ingredientsDescription,
    '', // item_data_source intentionally left empty
    dataRow.noteText,
  ];

  if (row.length !== EXPECTED_GOOGLE_SHEETS_COLUMN_COUNT) {
    throw new Error(
      `Google Sheets row width mismatch: expected ${EXPECTED_GOOGLE_SHEETS_COLUMN_COUNT}, got ${row.length}`
    );
  }

  return row;
}

validateSchemaContract(GOOGLE_SHEETS_SCHEMA);

async function getAuthClient(credentialsPath: string): Promise<JWT> {
  const keyFile = path.resolve(credentialsPath);
  const credentials = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
  
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
}

export async function appendRowToGoogleSheets(
  config: GoogleSheetsConfig,
  dataRow: ScrapeDataRow
): Promise<void> {
  try {
    const auth = await getAuthClient(config.credentialsPath);
    const sheets = google.sheets({ version: 'v4', auth });
    const row = buildGoogleSheetsRow(dataRow);
    const values = [row];

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: `${config.sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log(`Row appended to Google Sheets: ${dataRow.title}`);
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    throw error;
  }
}

export async function appendMultipleRowsToGoogleSheets(
  config: GoogleSheetsConfig,
  dataRows: ScrapeDataRow[]
): Promise<void> {
  for (const row of dataRows) {
    await appendRowToGoogleSheets(config, row);
  }
}
