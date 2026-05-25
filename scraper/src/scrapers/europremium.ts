import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeEuroPremium(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) =>
      $('h1').first().text().trim(),

    extractIngredientsDescription: ($) =>
      $('[san-id="open-Composition"]').first().text().trim(),

    extractCompositionText: ($, ingredientsDescription) => {
      const analyticalText = $('[san-id="open-Analytical components"]').first().text().trim();
      return [ingredientsDescription, analyticalText].filter((v) => v.length > 0).join('\n');
    },
  });
}
