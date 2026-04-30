import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeCarnilove(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1 .heading__text').text().trim(),
    extractIngredientsDescription: ($) => {
      return $('tray-component[data-tray-id="tray-ingredients"] .tray__content')
        .text()
        .trim();
    },
    extractCompositionText: ($, ingredientsDescription) => {
      const nutritionText = $('tray-component[data-tray-id="tray-nutrition"] .tray__content')
        .text()
        .trim();
      return [ingredientsDescription, nutritionText]
        .filter((v) => v.trim().length > 0)
        .join('\n');
    },
  });
}
