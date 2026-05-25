import type { CheerioAPI } from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

/**
 * Edgard & Cooper pages use Next.js App Router with React Server Components.
 * The product data (composition, analytical constituents, additives) is embedded
 * in `self.__next_f.push` script tags as a double-escaped JSON string —
 * the HeadlessUI Disclosure panels are collapsed (aria-expanded="false") and
 * their content is not rendered in the static HTML.
 */
function extractNextFValue($: CheerioAPI, key: string): string {
  let found = '';
  $('script').each((_, el) => {
    const c = $( el).html() || '';
    const marker = `\\"${key}\\":\\"`;
    const start = c.indexOf(marker);
    if (start === -1) return;
    const from = start + marker.length;
    const to = c.indexOf('\\"', from);
    if (to === -1) return;
    found = c.substring(from, to);
    return false;
  });
  return found;
}

export async function scrapeEdgardCooper(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1.font-imperfect').first().text().trim(),

    extractIngredientsDescription: ($) => extractNextFValue($, 'composition'),

    extractCompositionText: ($, ingredientsDescription) => {
      const analytical = extractNextFValue($, 'analyticalConstituents');
      const nutriAdditives = extractNextFValue($, 'nutritionalAdditives');
      const techAdditives = extractNextFValue($, 'technologicalAdditives');
      return [ingredientsDescription, analytical, nutriAdditives, techAdditives]
        .filter((v) => v.trim().length > 0)
        .join('\n');
    },
  });
}
