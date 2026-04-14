import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeAntos(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1[itemprop="name"]').text().trim(),
    extractIngredientsDescription: ($) => {
      const specsEl = $('#specs');
      const textParts: string[] = [];
      let inComposition = false;

      specsEl.contents().each((_, node) => {
        if (node.type === 'tag' && node.name === 'strong') {
          const text = $(node).text().trim();
          if (text === 'Composition') {
            inComposition = true;
            return;
          }
          if (text === 'Analytical Constituents') {
            return false; // stop iteration
          }
        }
        if (inComposition && node.type === 'text') {
          const t = (node as { data?: string }).data?.trim() ?? '';
          if (t) textParts.push(t);
        }
      });

      return textParts.join(', ').replace(/,\s*,/g, ',').trim();
    },
    extractCompositionText: ($, ingredientsDescription) => {
      const analysisLines: string[] = [];

      $('#specs table tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 2) {
          const label = $(cells[0]).text().trim();
          const value = $(cells[1]).text().trim();
          if (label && value) {
            analysisLines.push(`${label}: ${value}`);
          }
        }
      });

      return [ingredientsDescription, analysisLines.join('; ')]
        .filter((v) => v.trim().length > 0)
        .join('\n');
    },
  });
}
