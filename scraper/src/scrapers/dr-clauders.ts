import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeDrClauders(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1.product-detail__title').first().text().trim(),

    extractIngredientsDescription: ($) => $('#composition-content').text().trim(),

    extractCompositionText: ($) => $('#composition-content').text().trim(),
  });
}
