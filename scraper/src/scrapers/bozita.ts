import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

function findSectionText($: CheerioAPI, headingText: string): string {
  let text = '';
  $('div.product-detail h5').each((_, h5) => {
    if ($(h5).text().trim() === headingText) {
      text = $(h5).next('p').text().trim();
      return false;
    }
  });
  return text;
}

export async function scrapeBozita(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => {
      return $('h1.headline').first().text().trim();
    },

    extractIngredientsDescription: ($) => {
      return findSectionText($, 'COMPOSITION');
    },

    extractCompositionText: ($) => {
      const analyticalText = findSectionText($, 'ANALYTICAL CONSTITUENTS');
      const additivesText = findSectionText($, 'ADDITIVES (PER KG)');

      return [analyticalText, additivesText].filter(Boolean).join('\n');
    },
  });
}
