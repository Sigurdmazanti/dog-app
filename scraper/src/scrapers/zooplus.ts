import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeZooPlus(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1').text(),
    extractIngredientsDescription: ($) => {
      const fullIngredientsText = $('#ingredients .anchors_anchorsHTML___2lrv p').text();
      const split = fullIngredientsText.split('Tilsætningsstoffer');
      return split[0].replace(/^Ingredienser[:\s]*/i, '').trim();
    },
    extractCompositionText: ($) => {
      const fullIngredientsText = $('#ingredients .anchors_anchorsHTML___2lrv p').text();
      const analysisLines: string[] = [];
      $('table[data-zta="constituentsTable"] tr').each((_, el) => {
        const cells = $(el).find('td');
        if (cells.length === 2) {
          const label = $(cells[0]).text().trim();
          const value = $(cells[1]).text().trim();
          if (label && value) {
            analysisLines.push(`${label}: ${value}`);
          }
        }
      });
      return [fullIngredientsText, analysisLines.join('; ')]
        .filter((value) => value.trim().length > 0)
        .join('\n');
    },
  });
}
