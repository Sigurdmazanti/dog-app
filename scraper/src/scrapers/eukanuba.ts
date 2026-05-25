import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

function getIngredientsContainer($: CheerioAPI): ReturnType<CheerioAPI> {
  return $('[data-accordion-content][id="Ingredients"]');
}

export async function scrapeEukanuba(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1 span').first().text().trim(),

    extractIngredientsDescription: ($) => {
      const container = getIngredientsContainer($);
      return container.find('p').first().text().trim();
    },

    extractCompositionText: ($, ingredientsDescription) => {
      const container = getIngredientsContainer($);
      const parts: string[] = [];
      container.find('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 0) {
          parts.push(text);
        }
      });
      return parts.join('\n');
    },
  });
}
