import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import { ScrapeResult } from '../interfaces/scrapeResult';
import { ScrapeRequest } from '../interfaces/scrapeRequest';
import { runScraper } from '../helpers/runScraper';

function getCompositionTabContent($: CheerioAPI): Cheerio<Element> | null {
  let match: Cheerio<Element> | null = null;
  $('div.m-productTab').each((_, tab) => {
    const heading = $(tab).find('.m-productTab__title h2').first().text().trim();
    if (heading.toLowerCase() === 'composition') {
      match = $(tab).find('.m-productTab__text').first() as Cheerio<Element>;
      return false;
    }
  });
  return match;
}

function getSubSectionText(
  $: CheerioAPI,
  content: Cheerio<Element>,
  headingText: string
): string {
  const target = headingText.toLowerCase();
  const parts: string[] = [];
  let collecting = false;
  let stopped = false;

  content.children().each((_, el) => {
    if (stopped) return false;
    const $el = $(el);
    const strongText = $el.find('strong').first().text().trim();
    const elText = $el.text().trim();
    const isHeading = strongText.length > 0 && elText === strongText;

    if (isHeading) {
      if (collecting) {
        stopped = true;
        return false;
      }
      if (strongText.toLowerCase() === target) {
        collecting = true;
      }
      return;
    }

    if (collecting && elText) {
      parts.push(elText);
    }
  });
  return parts.join('\n').trim();
}

export async function scrapeCavom(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1.entry-title.product_title').first().text().trim(),

    extractIngredientsDescription: ($) => {
      const content = getCompositionTabContent($);
      if (!content) return '';
      return getSubSectionText($, content, 'Composition');
    },

    extractCompositionText: ($) => {
      const content = getCompositionTabContent($);
      if (!content) return '';
      const analytical = getSubSectionText($, content, 'Analytical Constituents');
      const additives = getSubSectionText($, content, 'Nutritional Additives');
      return [analytical, additives].filter(Boolean).join('\n');
    },
  });
}
