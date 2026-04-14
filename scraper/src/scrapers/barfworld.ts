import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeBarfworld(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1.product-title.title').first().text().trim(),
    extractIngredientsDescription: ($) =>
      $('#panel-ingredients .metafield-rich_text_field p').first().text().trim(),
    extractCompositionText: ($, ingredientsDescription) => {
      const constituentLines: string[] = [];
      $('#panel-guaranteed-analysis .metafield-rich_text_field li').each((_, el) => {
        const text = $(el).text().trim();
        if (text) {
          constituentLines.push(text);
        }
      });
      return [ingredientsDescription, constituentLines.join('; ')]
        .filter((v) => v.trim().length > 0)
        .join('\n');
    },
  });
}
