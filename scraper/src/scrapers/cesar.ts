import { ScrapeResult } from '../interfaces/scrapeResult';
import { ScrapeRequest } from '../interfaces/scrapeRequest';
import { runScraper } from '../helpers/runScraper';

export async function scrapeCesar(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1').first().text().trim(),
    extractIngredientsDescription: () => '',
    extractCompositionText: () => '',
  });
}
