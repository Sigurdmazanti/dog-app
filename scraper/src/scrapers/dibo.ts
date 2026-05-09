import type { Cheerio, CheerioAPI } from 'cheerio';
import type { AnyNode } from 'domhandler';
import { ScrapeResult } from '../interfaces/scrapeResult';
import { ScrapeRequest } from '../interfaces/scrapeRequest';
import { runScraper } from '../helpers/runScraper';

function findDetailsByHeading($: CheerioAPI, heading: string): Cheerio<AnyNode> | null {
  const target = heading.toLowerCase();
  let match: Cheerio<AnyNode> | null = null;
  $('details').each((_, el) => {
    const headingText = $(el).find('summary h4').first().text().trim().toLowerCase();
    if (headingText === target) {
      match = $(el);
      return false;
    }
  });
  return match;
}

export async function scrapeDibo(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1').first().text().trim(),

    extractIngredientsDescription: ($) => {
      const prose = $('div.font-serif p').first().text().trim();
      if (prose) return prose;

      const compositionDetails = findDetailsByHeading($, 'dish composition');
      if (!compositionDetails) return '';
      const items: string[] = [];
      compositionDetails.find('li').each((_, el) => {
        const text = $(el).text().trim();
        if (text) items.push(text);
      });
      return items.join('\n');
    },

    extractCompositionText: ($, ingredientsDescription) => {
      const compositionDetails = findDetailsByHeading($, 'dish composition');
      const nutritionDetails = findDetailsByHeading($, 'nutritional breakdown');

      const ingredientLines: string[] = [];
      if (compositionDetails) {
        compositionDetails.find('li').each((_, el) => {
          const text = $(el).text().trim();
          if (text) ingredientLines.push(text);
        });
      }

      const analyticalLines: string[] = [];
      if (nutritionDetails) {
        const dts: string[] = [];
        const dds: string[] = [];
        nutritionDetails.find('dt').each((_, el) => { dts.push($(el).text().trim()); });
        nutritionDetails.find('dd').each((_, el) => { dds.push($(el).text().trim()); });
        const len = Math.min(dts.length, dds.length);
        for (let i = 0; i < len; i++) {
          analyticalLines.push(`${dts[i]}: ${dds[i]}`);
        }
      }

      const parts: string[] = [];
      if (ingredientLines.length > 0) parts.push(ingredientLines.join('\n'));
      if (analyticalLines.length > 0) parts.push(analyticalLines.join('\n'));
      return parts.join('\n\n');
    },
  });
}
