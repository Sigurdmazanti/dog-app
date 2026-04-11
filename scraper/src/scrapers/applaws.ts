import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeApplaws(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => {
      const h1Title = $('h1.c-detail__title').text().trim();
      const subBrandText = $('.f-h5--filson').first().text().trim();

      if (!subBrandText) {
        return h1Title;
      }

      const cleanedPrefix = subBrandText
        .replace(/Applaws™?\s*/i, '')
        .replace(/\s*•\s*\d+\s*x\s*[\d.]+\s*(kg|g)/i, '')
        .trim();

      return [cleanedPrefix, h1Title].filter(Boolean).join(' ');
    },
    extractIngredientsDescription: ($) => {
      let ingredientsText = '';
      $('article.c-product__accordion').each((_, article) => {
        const buttonLabel = $(article).find('button .f-h6--filson').text().trim();
        if (buttonLabel === 'Composition') {
          ingredientsText = $(article).find('.f-body').text().trim();
          return false;
        }
      });
      return ingredientsText;
    },
    extractCompositionText: ($, ingredientsDescription) => {
      let nutritionText = '';
      $('article.c-product__accordion').each((_, article) => {
        const buttonLabel = $(article).find('button .f-h6--filson').text().trim();
        if (buttonLabel === 'Nutrition') {
          nutritionText = $(article).find('.f-body').text().trim();
          return false;
        }
      });
      return [ingredientsDescription, nutritionText]
        .filter((v) => v.trim().length > 0)
        .join('\n');
    },
  });
}
