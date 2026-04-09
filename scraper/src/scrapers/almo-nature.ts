import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeAlmoNature(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => {
      const category = $('span.product-category').text().trim();
      const flavor = $('span.product-flavor').text().trim();
      return [category, flavor].filter(Boolean).join(' ');
    },
    extractIngredientsDescription: ($) => $('#composition').text().trim(),
    extractCompositionText: ($, ingredientsDescription) => {
      const constituentsLines: string[] = [];
      $('#constituents ul li').each((_, el) => {
        const text = $(el).text().trim();
        if (text) {
          constituentsLines.push(text);
        }
      });
      const additivesText = $('.Product__additives').text().trim();
      return [ingredientsDescription, constituentsLines.join('; '), additivesText]
        .filter((value) => value.trim().length > 0)
        .join('\n');
    },
  });
}
