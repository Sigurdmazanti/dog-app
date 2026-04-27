import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { runScraper } from '../helpers/runScraper';

export async function scrapeCanex(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  return runScraper(scrapeRequest, {
    extractTitle: ($) => $('h1.product-title').text().trim(),

    extractIngredientsDescription: ($) => {
      // Try the "Sammensætning" accordion first (dry food products)
      let accordionInner = $();
      $('.accordion-title span').each((_, el) => {
        if ($(el).text().trim() === 'Sammensætning') {
          accordionInner = $(el).closest('.accordion-item').find('.accordion-inner');
          return false; // break
        }
      });

      if (accordionInner.length) {
        const paragraphs: string[] = [];
        accordionInner.children('p').each((_, el) => {
          const text = $(el).text().trim();
          if (text) paragraphs.push(text);
        });
        // Return paragraph text (ingredients) before the table
        return paragraphs.join(' ').trim();
      }

      // Fallback: extract from .product-short-description (treats)
      const shortDesc = $('.product-short-description');
      if (shortDesc.length) {
        const parts: string[] = [];
        shortDesc.find('p').each((_, el) => {
          const text = $(el).text().trim();
          if (text && !text.startsWith('Analyse:')) {
            parts.push(text);
          }
        });
        return parts.join(' ').trim();
      }

      return '';
    },

    extractCompositionText: ($, ingredientsDescription) => {
      const analysisLines: string[] = [];

      // Try accordion table first
      let accordionInner = $();
      $('.accordion-title span').each((_, el) => {
        if ($(el).text().trim() === 'Sammensætning') {
          accordionInner = $(el).closest('.accordion-item').find('.accordion-inner');
          return false;
        }
      });

      if (accordionInner.length) {
        accordionInner.find('table tr').each((_, row) => {
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            const label = $(cells[0]).text().trim();
            const value = $(cells[1]).text().trim();
            if (label && value) {
              analysisLines.push(`${label}: ${value}`);
            }
          }
        });
      }

      // Fallback: inline analysis from short description
      if (analysisLines.length === 0) {
        const shortDesc = $('.product-short-description');
        shortDesc.find('p').each((_, el) => {
          const text = $(el).text().trim();
          if (text.startsWith('Analyse:') || text.match(/^Analyse\b/i)) {
            analysisLines.push(text);
          }
        });
      }

      return [ingredientsDescription, analysisLines.join('; ')]
        .filter((v) => v.trim().length > 0)
        .join('\n');
    },
  });
}
