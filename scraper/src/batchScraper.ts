import { UrlWithFoodType } from './interfaces/urlWithFoodType';
import { findSource } from './sourceRegistry';
import { scrapeUrl } from './scraper';
import { appendRowToGoogleSheets } from './helpers/output/googleSheetsAppender';
import { log, logWarn, logError } from './helpers/utils/logger';

export interface BatchOptions {
  concurrency: number;
  appendToSheets: boolean;
  sheetsConfig: { spreadsheetId: string; sheetName: string; credentialsPath: string } | null;
}

export interface BatchSummary {
  succeeded: number;
  failed: number;
  skipped: number;
}

export async function runBatch(urls: UrlWithFoodType[], options: BatchOptions): Promise<BatchSummary> {
  const { default: pLimit } = await import('p-limit');

  const processable: UrlWithFoodType[] = [];
  const skippedUrls: string[] = [];

  for (const entry of urls) {
    if (findSource(entry.url)) {
      processable.push(entry);
    } else {
      skippedUrls.push(entry.url);
    }
  }

  for (const url of skippedUrls) {
    log('', `Skipped (unrecognised source): ${url}`);
  }

  if (processable.length === 0) {
    logWarn('', 'Warning: No processable URLs found matching registered sources.');
    return { succeeded: 0, failed: 0, skipped: skippedUrls.length };
  }

  const total = processable.length;
  log('', `[scraper] ${urls.length} urls found, ${total} processable, ${skippedUrls.length} skipped`);

  const limit = pLimit(options.concurrency);
  let succeeded = 0;
  let failed = 0;
  let completed = 0;

  const tasks = processable.map((entry) =>
    limit(async () => {
      completed++;
      const current = completed;
      const logPrefix = `[${current}/${total}]`;
      const taskStart = Date.now();
      log(logPrefix, `→ ${entry.url}`);
      try {
        const result = await scrapeUrl({ url: entry.url, foodType: entry.foodType, logPrefix });
        const elapsed = Date.now() - taskStart;

        if (options.appendToSheets && options.sheetsConfig) {
          try {
            await appendRowToGoogleSheets(options.sheetsConfig, result, logPrefix);
          } catch (sheetsError) {
            logError(logPrefix, `⚠ Sheets append failed for ${entry.url}: ${sheetsError}`);
          }
        }

        log(logPrefix, `✓ ${result.title || entry.url} (${elapsed}ms)`);
        succeeded++;
      } catch (error) {
        const elapsed = Date.now() - taskStart;
        const message = error instanceof Error ? error.message : String(error);
        log(logPrefix, `✗ ${entry.url} — ${message} (${elapsed}ms)`);
        failed++;
      }
    })
  );

  await Promise.all(tasks);

  log('', `\nDone: ${succeeded} succeeded, ${failed} failed, ${skippedUrls.length} skipped`);
  return { succeeded, failed, skipped: skippedUrls.length };
}
