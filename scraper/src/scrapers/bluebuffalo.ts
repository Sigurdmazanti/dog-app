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

export async function scrapeBluebuffalo(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => {
      const h3Text = $('h3[itemprop=name]').first().text().trim();
      const h1Text = $('h1').first().text().trim().replace(/[™®]/g, '').trim();

      if (!h1Text) {
        return h3Text;
      }

      return [h1Text, h3Text].filter(Boolean).join(' ');
    },

    extractIngredientsDescription: ($) => {
      const panelId = findTabpanelId($, 'Ingredients');
      if (!panelId) return '';

      const panel = $(`[id="${panelId}"]`);
      const wrapper = panel.find('.u-flex').first();
      const ingredients: string[] = [];

      wrapper.children().each((_, el) => {
        const tagText = $(el).attr('data-tag-text');
        if (tagText) {
          ingredients.push(tagText.trim());
        } else {
          const text = $(el).text().trim();
          if (text) ingredients.push(text);
        }
      });

      return ingredients.join(', ');
    },

    extractCompositionText: ($) => {
      const panelId = findTabpanelId($, 'Guaranteed Analysis');
      if (!panelId) return '';

      const panel = $(`[id="${panelId}"]`);
      const rows: string[] = [];

      panel.find('tr[role=row]').each((_, row) => {
        const name = $(row).find('th').text().trim();
        const value = $(row).find('td').text().trim();
        if (name && value) {
          rows.push(`${name}: ${value}`);
        }
      });

      return rows.join('\n');
    },
  });
}
