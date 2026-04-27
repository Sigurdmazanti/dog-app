import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

function findLabelledParagraph($: CheerioAPI, labelText: string): string {
  let text = '';
  $('p').each((_, p) => {
    const strong = $(p).children('strong').first();
    if (strong.length && strong.text().trim() === labelText) {
      text = $(p).clone().find('strong').remove().end().text().trim();
      return false;
    }
  });
  return text;
}

export async function scrapeBrit(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => {
      return $('h1[itemprop="name"]').first().text().trim();
    },

    extractIngredientsDescription: ($) => {
      return $('p.composition').clone().find('strong').remove().end().text().trim();
    },

    extractCompositionText: ($) => {
      const analyticalText = findLabelledParagraph($, 'Analytical ingredients:');
      const energyText = findLabelledParagraph($, 'Metabolizable energy:');

      return [analyticalText, energyText].filter(Boolean).join('\n');
    },
  });
}
