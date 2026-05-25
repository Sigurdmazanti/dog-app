import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

function findSectionText($: CheerioAPI, headingText: string): string {
  let text = '';
  $('h3').each((_, h3) => {
    if ($(h3).text().trim() === headingText) {
      text = $(h3).next('p').text().trim();
      return false;
    }
  });
  return text;
}

export async function scrapeAlphaSpirit(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1.elementor-heading-title').first().text().trim(),

    extractIngredientsDescription: ($) => findSectionText($, 'Sammansättning'),

    extractCompositionText: ($) => findSectionText($, 'Analys'),
  });
}
