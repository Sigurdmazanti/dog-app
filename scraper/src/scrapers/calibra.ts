import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeCalibra(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1.product-title').text().trim(),
    extractIngredientsDescription: ($) => {
      let bodyText = '';
      $('details').each((_, details) => {
        const titleText = $(details).find('summary h3.accordion__title').text().trim();
        if (titleText === 'Composition') {
          bodyText = $(details).find('div.accordion__content .metafield-rich_text_field').text().trim();
          return false;
        }
      });

      const separatorIndex = bodyText.search(/analytical constituents:/i);
      const ingredients = separatorIndex === -1 ? bodyText : bodyText.slice(0, separatorIndex).trim();
      return ingredients.replace(/^Composition:\s*/i, '').trim();
    },
    extractCompositionText: ($, ingredientsDescription) => {
      let bodyText = '';
      $('details').each((_, details) => {
        const titleText = $(details).find('summary h3.accordion__title').text().trim();
        if (titleText === 'Composition') {
          bodyText = $(details).find('div.accordion__content .metafield-rich_text_field').text().trim();
          return false;
        }
      });

      const separatorIndex = bodyText.search(/analytical constituents:/i);
      return separatorIndex === -1 ? '' : bodyText.slice(separatorIndex).trim();
    },
  });
}
