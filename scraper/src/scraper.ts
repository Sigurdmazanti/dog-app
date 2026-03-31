import { checkMissingFields } from './helpers/checkMissingFields';
import { ScrapeDataRow, ScrapeResult } from './interfaces/scrapeResult';
import { FoodType } from './interfaces/foodTypes';
import { ScrapeRequest } from './interfaces/scrapeRequest';
import { getDefaultWaterAmount } from './helpers/waterAmountMapper';
import { calculateMetabolizableEnergy, calculateNFE } from './helpers/nutritionCalculator';
import { appendRowToGoogleSheets } from './helpers/googleSheetsAppender';
import { findSource } from './sourceRegistry';
import { parseSitemapUrls } from './helpers/sitemapParser';
import { parseUrlListFile } from './helpers/urlListParser';
import { runBatch } from './batchScraper';
import * as dotenv from 'dotenv';

dotenv.config();

export async function scrapeUrl(scrapeRequest: ScrapeRequest): Promise<ScrapeDataRow> {
  try {
		const url: string = scrapeRequest.url;
    const foodType: FoodType = scrapeRequest.foodType;

    const source = findSource(url);
    if (!source) throw new Error('Unsupported URL');

    let noteText: string[] = [];
    const data: ScrapeResult = await source.scrape(scrapeRequest);

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

function getFlag(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return undefined;
  return process.argv[idx + 1];
}

function getSheetsConfig(): { spreadsheetId: string; sheetName: string; credentialsPath: string } | null {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME;
  const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;
  if (!spreadsheetId || !sheetName || !credentialsPath) return null;
  return { spreadsheetId, sheetName, credentialsPath };
}

async function main(): Promise<void> {
  const sitemapPath = getFlag('--sitemap');
  const urlsPath = getFlag('--urls');
  const foodTypeArg = getFlag('--food-type') ?? 'dry';
  const noSheets = process.argv.includes('--no-sheets');
  const concurrency = Number(getFlag('--concurrency') ?? '3');

  const appendToSheets = !noSheets;

  if (!Object.values(FoodType).includes(foodTypeArg as FoodType)) {
    console.error('Invalid food type. Must be one of:', Object.values(FoodType).join(', '));
    process.exit(1);
  }
  const foodType = foodTypeArg as FoodType;

  const sheetsConfig = appendToSheets ? getSheetsConfig() : null;
  if (appendToSheets && !sheetsConfig) {
    console.warn('Warning: Google Sheets config missing (GOOGLE_SPREADSHEET_ID, GOOGLE_SHEET_NAME, GOOGLE_CREDENTIALS_PATH). Skipping sheets append.');
  }

  // Batch mode: --sitemap
  if (sitemapPath) {
    const urls = await parseSitemapUrls(sitemapPath);
    const summary = await runBatch(urls, { foodType, concurrency, appendToSheets: appendToSheets && !!sheetsConfig, sheetsConfig });
    process.exit(summary.failed > 0 ? 1 : 0);
    return;
  }

  // Batch mode: --urls
  if (urlsPath) {
    const urls = parseUrlListFile(urlsPath);
    const summary = await runBatch(urls, { foodType, concurrency, appendToSheets: appendToSheets && !!sheetsConfig, sheetsConfig });
    process.exit(summary.failed > 0 ? 1 : 0);
    return;
  }

  // Single-URL mode: bare URL as first non-flag argument
  const positionalArgs = process.argv.slice(2).filter((arg) => !arg.startsWith('--') && (process.argv.indexOf(arg) === 2 || !['--sitemap', '--urls', '--food-type', '--concurrency'].includes(process.argv[process.argv.indexOf(arg) - 1])));
  const url = positionalArgs[0];

  if (!url) {
    console.log('Usage:');
    console.log('  npm run dev -- <url> [--food-type dry|wet] [--no-sheets]');
    console.log('  npm run dev -- --sitemap <path-or-url> [--food-type dry|wet] [--no-sheets] [--concurrency 3]');
    console.log('  npm run dev -- --urls <file> [--food-type dry|wet] [--no-sheets] [--concurrency 3]');
    process.exit(1);
  }

  const scrapeRequest: ScrapeRequest = { url, foodType };
  const result = await scrapeUrl(scrapeRequest);
  console.log('Scraping complete. Result:');
  console.log(JSON.stringify(result, null, 2));

  if (appendToSheets && sheetsConfig) {
    console.log('Appending result to Google Sheets...');
    try {
      await appendRowToGoogleSheets(sheetsConfig, result);
    } catch (error) {
      console.error('Failed to append to Google Sheets:', error);
      process.exit(1);
    }
  }
}
 
main();
