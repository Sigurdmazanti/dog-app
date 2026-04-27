import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

function findSectionText($: CheerioAPI, headingText: string): string {
  let text = '';
  $('div.pd-region h4').each((_, h4) => {
    if ($(h4).text().trim() === headingText) {
      text = $(h4).next('p').text().trim();
      return false;
    }
  });
  return text;
}

export async function scrapeCanagan(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => {
      return $('h1.product-name div').eq(1).text().trim();
    },

    extractIngredientsDescription: ($) => {
      return findSectionText($, 'COMPOSITION');
    },

    extractCompositionText: ($) => {
      const analyticalText = findSectionText($, 'ANALYTICAL CONSTITUENTS');
      const additivesText = findSectionText($, 'NUTRITIONAL ADDITIVES (PER KG)');

      return [analyticalText, additivesText].filter(Boolean).join('\n');
    },
  });
}
