import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

function findTabContent($: CheerioAPI, labelPattern: RegExp): string {
  let tabId: string | undefined;
  $('.product-tabs-buttons a[href]').each((_, el) => {
    if (labelPattern.test($(el).text().trim())) {
      tabId = ($(el).attr('href') as string).slice(1);
      return false;
    }
  });
  if (!tabId) return '';
  return $(`#${tabId}`).text().replace(/\s+/g, ' ').trim();
}

export async function scrapeBellfor(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) =>
      $('h1.product-page-heading').first().text().trim(),
    extractIngredientsDescription: ($) =>
      findTabContent($, /ingredients/i),
    extractCompositionText: ($, ingredientsDescription) => {
      const additives = findTabContent($, /additives/i);
      const nutrientAnalysis = findTabContent($, /nutrient/i);
      return [ingredientsDescription, additives, nutrientAnalysis]
        .filter((v) => v.trim().length > 0)
        .join('\n');
    },
  });
}
