import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeAcanaEu(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) =>
      $('h3.product-name.show-desktop')
        .contents()
        .filter((_, el) => el.type === 'text')
        .text()
        .trim(),
    extractIngredientsDescription: ($) =>
      $('.ingredients-list p').first().text().trim(),
    extractCompositionText: ($) => {
      const constituentsText = $('.analysis').text().trim();
      const compositionText = $('.ingredients-list p').not(':first').text().trim();
      return compositionText + constituentsText;
    },
  });
}