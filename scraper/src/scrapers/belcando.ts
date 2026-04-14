import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

function extractColumnByLabel($: CheerioAPI, label: string): string {
  let text = '';
  $('.product-detail-analyse-text .row.mb-3 > .col-md').each((_, el) => {
    const firstStrong = $(el).children('strong').first();
    if (firstStrong.text().trim() === label) {
      const clone = $(el).clone();
      clone.children('strong').first().remove();
      text = clone.text().trim();
      return false;
    }
  });
  return text;
}

export async function scrapeBelcando(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) =>
      [
        $('.product-detail-name-manufacturer').first().text().trim(),
        $('h1.product-detail-name').first().text().trim(),
      ]
        .filter(Boolean)
        .join(' '),
    extractIngredientsDescription: ($) => extractColumnByLabel($, 'Composition'),
    extractCompositionText: ($, ingredientsDescription) => {
      const constituents = extractColumnByLabel($, 'Analytical constituents');
      const additives = extractColumnByLabel($, 'Additives per kg');
      return [ingredientsDescription, constituents, additives]
        .filter((v) => v.trim().length > 0)
        .join('\n');
    },
  });
}
