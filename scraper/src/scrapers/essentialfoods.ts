import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

function findAccordionText($: CheerioAPI, headingText: string): string {
  let text = '';
  $('details.accordion').each((_, el) => {
    const title = $(el).find('summary.accordion__title').text();
    if (title.includes(headingText)) {
      text = $(el).find('.accordion__content').text().trim();
      return false;
    }
  });
  return text;
}

export async function scrapeEssentialFoods(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) =>
      $('h1.heading-size-6.product__title span[data-zoom-caption]').first().text().trim(),

    extractIngredientsDescription: ($) => {
      let text = '';
      $('details.accordion').each((_, el) => {
        const title = $(el).find('summary.accordion__title').text();
        if (title.includes('THE RECIPE')) {
          text = $(el).find('.accordion__content .metafield-rich_text_field p').first().text().trim();
          return false;
        }
      });
      return text;
    },

    extractCompositionText: ($) => {
      let nutritionalText = '';
      $('details.accordion').each((_, el) => {
        const title = $(el).find('summary.accordion__title').text();
        if (title.includes('NUTRITIONAL VALUES')) {
          const lines: string[] = [];
          $(el).find('ul.nutritional-values li').each((_, li) => {
            const desc = $(li).find('.nutritional-description').text().trim();
            const pct = $(li).find('.nutritional-percentage').text().trim();
            if (desc) lines.push(`${desc}: ${pct}`);
          });
          nutritionalText = lines.join('\n');
          return false;
        }
      });

      const additivesText = findAccordionText($, 'ADDITIVES PER KG');

      return [nutritionalText, additivesText].filter((v) => v.length > 0).join('\n');
    },
  });
}
