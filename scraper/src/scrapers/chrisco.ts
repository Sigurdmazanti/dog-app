import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

function findTabPanelIdByHref($: CheerioAPI, tabLabel: string): string | null {
  let panelId: string | null = null;
  $('a.data.switch').each((_, el) => {
    if ($(el).text().trim() === tabLabel) {
      const href = $(el).attr('href') ?? '';
      panelId = href.replace(/^#/, '') || null;
      return false;
    }
  });
  return panelId;
}

export async function scrapeChrisco(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => {
      return $('h1.page-title').first().text().trim();
    },

    extractIngredientsDescription: ($) => {
      const panelId = findTabPanelIdByHref($, 'Næringsindhold');
      if (!panelId) return '';
      return $(`#${panelId}`).text().trim();
    },

    extractCompositionText: ($) => {
      const panelId = findTabPanelIdByHref($, 'Næringsindhold');
      if (!panelId) return '';
      return $(`#${panelId}`).text().trim();
    },
  });
}
