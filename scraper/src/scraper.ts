import { checkMissingFields } from './helpers/checkMissingFields';
import { ScrapeDataRow, ScrapeResult } from './interfaces/scrapeResult';
import { scrapeZooPlus } from './scrapers/zooplus';
import { FoodType } from './interfaces/foodTypes';
import { ScrapeRequest } from './interfaces/scrapeRequest';
import { getDefaultWaterAmount } from './helpers/waterAmountMapper';
import { calculateMetabolizableEnergy, calculateNFE } from './helpers/nutritionCalculator';
import { appendRowToGoogleSheets } from './helpers/googleSheetsAppender';
import * as dotenv from 'dotenv';

dotenv.config();

async function scrapeUrl(scrapeRequest: ScrapeRequest): Promise<ScrapeDataRow> {
  try {
		const url: string = scrapeRequest.url;
    const foodType: FoodType = scrapeRequest.foodType;

    let data: ScrapeResult;
    let noteText: string[] = [];

    if (url.includes('zooplus')) data = await scrapeZooPlus(scrapeRequest);
    else throw new Error('Unsupported URL');

    noteText.push(...checkMissingFields(data));

    if (data.nutritionData.water === undefined || data.nutritionData.water === 0) {
      const waterAmount: number = getDefaultWaterAmount(foodType);
      data.nutritionData.water = waterAmount;
      noteText.push(`Ingen vand-værdi. Sat til ${waterAmount}%`);
    }

    if (data.nutritionData.nfe === undefined || data.nutritionData.nfe === 0) {
      const nfeAmount: number = calculateNFE(data.nutritionData);
      data.nutritionData.nfe = nfeAmount;
      noteText.push(`Ingen NFE-værdi. Udregnet til ${nfeAmount}%.`);
    }

		if (data.nutritionData.kiloJoule === undefined || data.nutritionData.kiloJoule === 0) {
			const kiloJouleAmount: number = calculateMetabolizableEnergy(data.nutritionData);
			data.nutritionData.kiloJoule = kiloJouleAmount;
			noteText.push(`Ingen energi-værdi. Udregnet til ${kiloJouleAmount} kJ.`);
		}
			
		const dataRow: ScrapeDataRow = {
			...data,
			foodType,
			noteText: noteText.filter(Boolean).join('\n'), // TODO: \n eller .join(' ')? til CSV
		};

	  return dataRow;
  } catch (err) {
    throw err;
  }
}

async function main(): Promise<void> {
  const url = process.argv[2];
  const foodType: FoodType = process.argv[3] as FoodType;
  const appendToSheets = process.argv.includes('--append-sheets');

  if (!Object.values(FoodType).includes(foodType)) {
    console.log('Invalid food type. Must be one of:', Object.values(FoodType).join(', '));
    process.exit(1);
  }
  
  if (!url) {
    console.log('Usage: ts-node src/scraper.ts <url> <foodType> [--append-sheets]');
    process.exit(1);
  }

  const scrapeRequest: ScrapeRequest = { url, foodType };
  const result = await scrapeUrl(scrapeRequest);
  console.log('Scraping complete. Result:');
  console.log(JSON.stringify(result, null, 2));

  // Append to Google Sheets if requested
  if (appendToSheets) {
    console.log('Appending result to Google Sheets...');
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const sheetName = process.env.GOOGLE_SHEET_NAME;
    const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;

    if (!spreadsheetId || !sheetName || !credentialsPath) {
      console.error('Missing Google Sheets configuration. Please set GOOGLE_SPREADSHEET_ID, GOOGLE_SHEET_NAME, and GOOGLE_CREDENTIALS_PATH in .env');
      process.exit(1);
    }

    try {
      await appendRowToGoogleSheets(
        { spreadsheetId, sheetName, credentialsPath },
        result
      );
    } catch (error) {
      console.error('Failed to append to Google Sheets:', error);
      process.exit(1);
    }
  }
}
 
main();
