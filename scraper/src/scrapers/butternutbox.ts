import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeButternutbox(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('[data-testid="title"]').first().text().trim(),

    extractIngredientsDescription: ($) => {
      let ingredientsText = '';
      $('button').each((_, btn) => {
        const label = $(btn).find('p').first().text().trim();
        if (label === 'Ingredients') {
          const accordion = $(btn).closest('[class*="MuiAccordion-root"]');
          ingredientsText = accordion.find('[data-testid="rich-text"]').text().trim();
          return false;
        }
      });
      return ingredientsText;
    },

    extractCompositionText: ($, ingredientsDescription) => {
      let nutritionText = '';
      $('button').each((_, btn) => {
        const label = $(btn).find('p').first().text().trim();
        if (label === 'Nutritional info') {
          const accordion = $(btn).closest('[class*="MuiAccordion-root"]');
          nutritionText = accordion.find('[data-testid="rich-text"]').text().trim();
          return false;
        }
      });
      return [ingredientsDescription, nutritionText]
        .filter((v) => v.trim().length > 0)
        .join('\n');
    },
  });
}
