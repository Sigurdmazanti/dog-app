import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeAnimonda(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1.product-detail-title').text().trim(),
    extractIngredientsDescription: ($) =>
      $('.product-detail-composition__main-content')
        .clone()
        .children('h3')
        .remove()
        .end()
        .text()
        .trim(),
    extractCompositionText: ($, ingredientsDescription) => {
      const analysisLines: string[] = [];
      $('.product-detail-ingredients__list-item').each((_, el) => {
        const label = $(el).find('.product-detail-ingredients__item-description').text().trim();
        const value = $(el).find('.product-detail-ingredients__item-value').text().trim();
        if (label && value) {
          analysisLines.push(`${label}: ${value}`);
        }
      });
      const additivesLines: string[] = [];
      $('.product-detail-nutritional-additives__list li').each((_, el) => {
        const text = $(el).find('p').text().trim();
        if (text) {
          additivesLines.push(text);
        }
      });
      return [ingredientsDescription, analysisLines.join('; '), additivesLines.join('; ')]
        .filter((value) => value.trim().length > 0)
        .join('\n');
    },
  });
}
