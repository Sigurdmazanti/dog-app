import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeAmanova(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => {
      const productName = $('#title-product').text().trim();
      const subtitle = $('h2.product__text').text().trim();
      return [productName, subtitle].filter(Boolean).join(' — ');
    },
    extractIngredientsDescription: ($) =>
      $('.accordion__content .metafield-rich_text_field').first().text().trim(),
    extractCompositionText: ($, ingredientsDescription) => {
      const componentsText = $('.accordion__content .metafield-multi_line_text_field').text().trim();
      return [ingredientsDescription, componentsText]
        .filter((value) => value.trim().length > 0)
        .join('\n');
    },
  });
}
