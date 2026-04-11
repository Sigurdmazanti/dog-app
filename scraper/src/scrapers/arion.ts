import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeArion(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1.entry-title.product_title').text().trim(),
    extractIngredientsDescription: ($) => {
      let ingredientsText = '';
      $('#tab-description b').each((_, el) => {
        if ($(el).text().trim() === 'Ingredienser:') {
          const ul = $(el).closest('p').next('ul');
          const items: string[] = [];
          ul.find('li').each((_, li) => {
            const text = $(li).text().trim();
            if (text) items.push(text);
          });
          ingredientsText = items.join(', ');
          return false;
        }
      });
      return ingredientsText;
    },
    extractCompositionText: ($, ingredientsDescription) => {
      const constituentLines: string[] = [];
      $('.nutrition-tab__table .nutrition-tab__table__row').each((_, row) => {
        const spans = $(row).children('span');
        if (spans.length >= 2) {
          const label = $(spans[0]).text().trim();
          const value = $(spans[1]).text().trim();
          if (label && value) {
            constituentLines.push(`${label}: ${value}`);
          }
        }
      });
      return [ingredientsDescription, constituentLines.join('; ')]
        .filter((v) => v.trim().length > 0)
        .join('\n');
    },
  });
}
