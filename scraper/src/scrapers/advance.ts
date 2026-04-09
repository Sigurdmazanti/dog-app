import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeAdvance(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1.product-title').text().trim(),
    extractIngredientsDescription: ($) =>
      $('.ings-content .metafield-rich_text_field').text().trim(),
    extractCompositionText: ($, ingredientsDescription) => {
      const analysisLines: string[] = [];
      $('.nutritional-table table tr').each((_, el) => {
        const cells = $(el).find('td');
        if (cells.length === 2) {
          const label = $(cells[0]).text().trim();
          const value = $(cells[1]).text().trim();
          if (label && value) {
            analysisLines.push(`${label}: ${value}`);
          }
        }
      });
      return [ingredientsDescription, analysisLines.join('; ')]
        .filter((value) => value.trim().length > 0)
        .join('\n');
    },
  });
}
