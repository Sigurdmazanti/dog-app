import { FoodType } from './interfaces/foodTypes';
import { findSource } from './sourceRegistry';
import { scrapeUrl } from './scraper';
import { appendRowToGoogleSheets } from './helpers/googleSheetsAppender';

export interface BatchOptions {
  foodType: FoodType;
  concurrency: number;
  appendToSheets: boolean;
  sheetsConfig: { spreadsheetId: string; sheetName: string; credentialsPath: string } | null;
}

export interface BatchSummary {
  succeeded: number;
  failed: number;
  skipped: number;
}

export async function runBatch(urls: string[], options: BatchOptions): Promise<BatchSummary> {
  const { default: pLimit } = await import('p-limit');

  const processable: string[] = [];
  const skippedUrls: string[] = [];

  for (const url of urls) {
    if (findSource(url)) {
      processable.push(url);
    } else {
      skippedUrls.push(url);
    }
  }

  for (const url of skippedUrls) {
    console.log(`Skipped (unrecognised source): ${url}`);
  }

  if (processable.length === 0) {
    console.warn('Warning: No processable URLs found matching registered sources.');
    return { succeeded: 0, failed: 0, skipped: skippedUrls.length };
  }

  const total = processable.length;
  console.log(`[scraper] ${urls.length} urls found, ${total} processable, ${skippedUrls.length} skipped`);

  const limit = pLimit(options.concurrency);
  let succeeded = 0;
  let failed = 0;
  let completed = 0;

  const tasks = processable.map((url) =>
    limit(async () => {
      completed++;
      const current = completed;
      const taskStart = Date.now();
      console.log(`[${current}/${total}] → ${url}`);
      try {
        const result = await scrapeUrl({ url, foodType: options.foodType });
        const elapsed = Date.now() - taskStart;

        if (options.appendToSheets && options.sheetsConfig) {
          try {
            await appendRowToGoogleSheets(options.sheetsConfig, result);
          } catch (sheetsError) {
            console.error(`[${current}/${total}] ⚠ Sheets append failed for ${url}: ${sheetsError}`);
          }
        }

        console.log(`[${current}/${total}] ✓ ${result.title || url} (${elapsed}ms)`);
        succeeded++;
      } catch (error) {
        const elapsed = Date.now() - taskStart;
        const message = error instanceof Error ? error.message : String(error);
        console.log(`[${current}/${total}] ✗ ${url} — ${message} (${elapsed}ms)`);
        failed++;
      }
    })
  );

  await Promise.all(tasks);

  console.log(`\nDone: ${succeeded} succeeded, ${failed} failed, ${skippedUrls.length} skipped`);
  return { succeeded, failed, skipped: skippedUrls.length };
}
