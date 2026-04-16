import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

function findTabpanelId($: CheerioAPI, tabLabel: string): string | null {
  let panelId: string | null = null;
  $('[role=tab]').each((_, tab) => {
    if ($(tab).text().trim() === tabLabel) {
      panelId = $(tab).attr('aria-controls') ?? null;
      return false;
    }
  });
  return panelId;
}

export async function scrapeBosch(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => {
      const brandText = $('div.product-brand-name a').first().text().trim();
      const h1Text = $('h1').first().text().trim();

      if (!brandText) {
        return h1Text;
      }

      return [brandText, h1Text].filter(Boolean).join(' ');
    },

    extractIngredientsDescription: ($) => {
      const panelId = findTabpanelId($, 'Composition');
      if (!panelId) return '';

      return $(`[id="${panelId}"]`).text().trim();
    },

    extractCompositionText: ($) => {
      const analyticalPanelId = findTabpanelId($, 'Analytical components');
      const analyticalText = analyticalPanelId
        ? $(`[id="${analyticalPanelId}"]`).text().trim()
        : '';

      const supplementsPanelId = findTabpanelId($, 'Supplements');
      const supplementsText = supplementsPanelId
        ? $(`[id="${supplementsPanelId}"]`).text().trim()
        : '';

      return [analyticalText, supplementsText].filter(Boolean).join('\n');
    },
  });
}
