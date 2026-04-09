import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { ScrapeDataRow } from '../interfaces/scrapeResult';
import * as path from 'path';
import * as fs from 'fs';
import { log, logError } from './logger';

interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  credentialsPath: string;
}

type ColumnValue = string | number;

function formatCopenhagenTimestamp(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Copenhagen',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'longOffset',
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const offset = get('timeZoneName').replace('GMT', '') || '+00:00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}${offset}`;
}

export const GOOGLE_SHEETS_SCHEMA = [
  'item_id',
  'item_name',
  'item_brand',
  'item_url',
  'item_unit_weight_grams',
  'item_food_type',
  'item_me_kj_per_100g',
  'item_protein_g_per_100g',
  'item_fat_g_per_100g',
  'item_fibers_g_per_100g',
  'item_nfe_g_per_100g',
  'item_crude_ash_g_per_100g',
  'item_water_g_per_100g',
  'item_salt_g_per_100g',
  'item_calcium_mg_per_100g',
  'item_phosphorus_mg_per_100g',
  'item_sodium_mg_per_100g',
  'item_magnesium_mg_per_100g',
  'item_potassium_mg_per_100g',
  'item_chlorine_mg_per_100g',
  'item_sulfur_mg_per_100g',
  'item_iron_mg_per_100g',
  'item_copper_mg_per_100g',
  'item_manganese_mg_per_100g',
  'item_zinc_mg_per_100g',
  'item_iodine_ug_per_100g',
  'item_selenium_ug_per_100g',
  'item_clinoptilolit_mg_per_100g',
  'item_cobalt_ug_per_100g',
  'item_molybdæn_ug_per_100g',
  'item_fluoride_ug_per_100g',
  'item_silicon_mg_per_100g',
  'item_chromium_ug_per_100g',
  'item_vanadium_ug_per_100g',
  'item_nickel_ug_per_100g',
  'item_tin_ug_per_100g',
  'item_arsenic_ug_per_100g',
  'item_lead_ug_per_100g',
  'item_cadmium_ug_per_100g',
  'item_mercury_ug_per_100g',
  'item_thiamine_mg_per_100g',
  'item_riboflavin_mg_per_100g',
  'item_niacin_mg_per_100g',
  'item_pantothenic_acid_mg_per_100g',
  'item_pyridoxine_mg_per_100g',
  'item_biotin_ug_per_100g',
  'item_folate_ug_per_100g',
  'item_cobalamin_ug_per_100g',
  'item_vitamin_c_mg_per_100g',
  'item_vitamin_a_re_ug_per_100g',
  'item_vitamin_d_ug_per_100g',
  'item_vitamin_d3_ug_per_100g',
  'item_vitamin_d2_ug_per_100g',
  'item_25_hydroxy_vitamin_d3_ug_per_100g',
  'item_25_hydroxy_vitamin_d2_ug_per_100g',
  'item_vitamin_e_alfa_te_mg_per_100g',
  'item_vitamin_k_ug_per_100g',
  'item_vitamin_k1_ug_per_100g',
  'item_vitamin_k2_ug_per_100g',
  'item_sorbitol_g_per_100g',
  'item_sugar_g_per_100g',
  'item_ingredients_description',
  'item_data_source',
  'item_note',
  'item_created_at',
  'item_updated_at',
] as const;

export const EXPECTED_GOOGLE_SHEETS_COLUMN_COUNT = GOOGLE_SHEETS_SCHEMA.length;

type GoogleSheetsColumn = (typeof GOOGLE_SHEETS_SCHEMA)[number];

function toColumnValue(value: string | number | undefined | null): ColumnValue {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return '';
}

function createColumnResolvers(dataRow: ScrapeDataRow): Record<GoogleSheetsColumn, ColumnValue> {
  const scrapedAt = new Date();
  return {
    item_id: '',
    item_name: toColumnValue(dataRow.title),
    item_brand: toColumnValue(dataRow.brand),
    item_url: toColumnValue(dataRow.url),
    item_unit_weight_grams: 100,
    item_food_type: toColumnValue(dataRow.foodType),
    item_me_kj_per_100g: toColumnValue(dataRow.nutritionData.kiloJoule),
    item_protein_g_per_100g: toColumnValue(dataRow.nutritionData.protein),
    item_fat_g_per_100g: toColumnValue(dataRow.nutritionData.fat),
    item_fibers_g_per_100g: toColumnValue(dataRow.nutritionData.fiber),
    item_nfe_g_per_100g: toColumnValue(dataRow.nutritionData.nfe),
    item_crude_ash_g_per_100g: toColumnValue(dataRow.nutritionData.crudeAsh),
    item_water_g_per_100g: toColumnValue(dataRow.nutritionData.water),
    item_sugar_g_per_100g: toColumnValue(dataRow.nutritionData.sugar),
    item_salt_g_per_100g: toColumnValue(dataRow.saltsData.sodiumChloride),
    item_calcium_mg_per_100g: toColumnValue(dataRow.mineralsData.calcium),
    item_phosphorus_mg_per_100g: toColumnValue(dataRow.mineralsData.phosphorus),
    item_sodium_mg_per_100g: toColumnValue(dataRow.mineralsData.sodium),
    item_magnesium_mg_per_100g: toColumnValue(dataRow.mineralsData.magnesium),
    item_potassium_mg_per_100g: toColumnValue(dataRow.mineralsData.potassium),
    item_chlorine_mg_per_100g: toColumnValue(dataRow.mineralsData.chlorine),
    item_sulfur_mg_per_100g: toColumnValue(dataRow.mineralsData.sulphur),
    item_iron_mg_per_100g: toColumnValue(dataRow.mineralsData.iron),
    item_copper_mg_per_100g: toColumnValue(dataRow.mineralsData.copper),
    item_manganese_mg_per_100g: toColumnValue(dataRow.mineralsData.manganese),
    item_zinc_mg_per_100g: toColumnValue(dataRow.mineralsData.zinc),
    item_iodine_ug_per_100g: toColumnValue(dataRow.mineralsData.iodine),
    item_selenium_ug_per_100g: toColumnValue(dataRow.mineralsData.selenium),
    item_clinoptilolit_mg_per_100g: toColumnValue(dataRow.mineralsData.clinoptilolite),
    item_cobalt_ug_per_100g: toColumnValue(dataRow.mineralsData.cobalt),
    item_molybdæn_ug_per_100g: toColumnValue(dataRow.mineralsData.molybdenum),
    item_fluoride_ug_per_100g: toColumnValue(dataRow.mineralsData.fluorine),
    item_silicon_mg_per_100g: toColumnValue(dataRow.mineralsData.silicon),
    item_chromium_ug_per_100g: toColumnValue(dataRow.mineralsData.chromium),
    item_vanadium_ug_per_100g: toColumnValue(dataRow.mineralsData.vanadium),
    item_nickel_ug_per_100g: toColumnValue(dataRow.mineralsData.nickel),
    item_tin_ug_per_100g: toColumnValue(dataRow.mineralsData.tin),
    item_arsenic_ug_per_100g: toColumnValue(dataRow.mineralsData.arsenic),
    item_lead_ug_per_100g: toColumnValue(dataRow.mineralsData.lead),
    item_cadmium_ug_per_100g: toColumnValue(dataRow.mineralsData.cadmium),
    item_mercury_ug_per_100g: toColumnValue(dataRow.mineralsData.mercury),
    item_thiamine_mg_per_100g: toColumnValue(dataRow.vitaminsData.b1),
    item_riboflavin_mg_per_100g: toColumnValue(dataRow.vitaminsData.b2),
    item_niacin_mg_per_100g: toColumnValue(dataRow.vitaminsData.b3),
    item_pantothenic_acid_mg_per_100g: toColumnValue(dataRow.vitaminsData.b5),
    item_pyridoxine_mg_per_100g: toColumnValue(dataRow.vitaminsData.b6),
    item_biotin_ug_per_100g: toColumnValue(dataRow.vitaminsData.b7),
    item_folate_ug_per_100g: toColumnValue(dataRow.vitaminsData.b9),
    item_cobalamin_ug_per_100g: toColumnValue(dataRow.vitaminsData.b12),
    item_vitamin_c_mg_per_100g: toColumnValue(dataRow.vitaminsData.cVitamin),
    item_vitamin_a_re_ug_per_100g: toColumnValue(dataRow.vitaminsData.aVitamin),
    item_vitamin_d_ug_per_100g: toColumnValue(dataRow.vitaminsData.dVitamin),
    item_vitamin_d3_ug_per_100g: toColumnValue(dataRow.vitaminsData.dVitamin3),
    item_vitamin_d2_ug_per_100g: toColumnValue(dataRow.vitaminsData.dVitamin2),
    item_25_hydroxy_vitamin_d3_ug_per_100g: toColumnValue(dataRow.vitaminsData.hydroxyVitaminD3),
    item_25_hydroxy_vitamin_d2_ug_per_100g: toColumnValue(dataRow.vitaminsData.hydroxyVitaminD2),
    item_vitamin_e_alfa_te_mg_per_100g: toColumnValue(dataRow.vitaminsData.eVitamin),
    item_vitamin_k_ug_per_100g: toColumnValue(dataRow.vitaminsData.kVitamin),
    item_vitamin_k1_ug_per_100g: toColumnValue(dataRow.vitaminsData.k1Vitamin),
    item_vitamin_k2_ug_per_100g: toColumnValue(dataRow.vitaminsData.k2Vitamin),
    item_sorbitol_g_per_100g: toColumnValue(dataRow.sugarAlcoholsData.sorbitol),
    item_ingredients_description: toColumnValue(dataRow.ingredientsDescription),
    item_data_source: toColumnValue(dataRow.dataSource),
    item_note: toColumnValue(dataRow.noteText),
    item_created_at: formatCopenhagenTimestamp(scrapedAt),
    item_updated_at: formatCopenhagenTimestamp(scrapedAt),
  };
}

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
  const columnResolvers = createColumnResolvers(dataRow);
  const row = GOOGLE_SHEETS_SCHEMA.map((column) => {
    const value = columnResolvers[column];
    return toColumnValue(value);
  });

  if (row.length !== EXPECTED_GOOGLE_SHEETS_COLUMN_COUNT) {
    throw new Error(
      `Google Sheets row width mismatch: expected ${EXPECTED_GOOGLE_SHEETS_COLUMN_COUNT}, got ${row.length}`
    );
  }

  if (Object.keys(columnResolvers).length !== EXPECTED_GOOGLE_SHEETS_COLUMN_COUNT) {
    throw new Error(
      `Google Sheets resolver mismatch: expected ${EXPECTED_GOOGLE_SHEETS_COLUMN_COUNT} mapped columns, got ${Object.keys(columnResolvers).length}`
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
  dataRow: ScrapeDataRow,
  logPrefix = '',
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

    log(logPrefix, `Row appended to Google Sheets: ${dataRow.title}`);
  } catch (error) {
    logError(logPrefix, 'Error appending to Google Sheets:', error);
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
