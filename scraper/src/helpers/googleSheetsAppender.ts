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

    const values = [
      [
        '', // ID
        dataRow.title,
        dataRow.url,
        100, // weight
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
        '', // chlorine
        '', // sulfur
        '', // iron
        '', // item_copper_per_100g
        '', // item_manganese_per_100g
        '', // item_zinc_per_100g
        '', // item_iodine_per_100g
        '', // item_selenium_per_100g
        '', // item_thiamine_per_100g
        '', // item_riboflavin_per_100g
        '', // item_niacian_per_100g
        '', // item_pantothenic_acid_per_100g
        '', // item_pyridoxine_per_100g
        '', // item_biotin_per_100g
        '', // item_folate_per_100g
        '', // item_cobalamin_per_100g
        '', // item_vitamin_c_per_100g
        '', // item_vitamin_a_per_100g
        '', // item_vitamin_d_per_100g
        '', // item_vitamin_e_per_100g
        '', // item_vitamin_k_per_100g
        dataRow.ingredientsDescription,
        dataRow.noteText,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: `${config.sheetName}!A:M`, // Adjust column range as needed
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
