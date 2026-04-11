import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeAvlskovgaard(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('div.product__title h1').first().text().trim(),
    extractIngredientsDescription: ($) => {
      let ingredientsText = '';
      $('.accordion__content.rte h3').each((_, el) => {
        if ($(el).text().includes('INGREDIENSER')) {
          ingredientsText = $(el).next('p').text().trim();
          return false;
        }
      });
      return ingredientsText;
    },
    extractCompositionText: ($, ingredientsDescription) => {
      const constituentLines: string[] = [];
      $('table.nutrition-table tr').each((_, row) => {
        const cells = $(row).children('td');
        if (cells.length >= 2) {
          const label = $(cells[0]).text().trim();
          const value = $(cells[1]).text().trim();
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
