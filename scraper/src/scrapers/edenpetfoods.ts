// NOTE: This scraper does NOT use runScraper / Cheerio HTML parsing.
//
// edenpetfoods.com is an AngularJS SPA. The server-rendered HTML contains only
// an empty directive: <product-page-details sku="PUW2kg"></product-page-details>
// All product data is loaded client-side via a JSON API call, so Axios + Cheerio
// would see no composition text at all.
//
// Instead, we call the site's own internal API directly:
//   POST /api/product-page-details
//   Content-Type: application/x-www-form-urlencoded
//   body: sku=<sku>
//
// The AI composition mapper (mapProductCompositionWithAI) is called explicitly
// here — this is the same step that runScraper performs internally for every
// other scraper. The end result is identical to the standard pipeline.

import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { mapProductCompositionWithAI } from '../helpers/composition/aiProductCompositionMapper';
import {
  AminoAcidsData,
  FattyAcidsData,
  MineralsData,
  NutritionData,
  SaltsData,
  SugarAlcoholsData,
  VitaminLikeData,
  VitaminsData,
} from '../interfaces/productComposition';
import { log, logWarn } from '../helpers/utils/logger';

// The SKU lives in the third path segment: /shop/product/<sku>[/optional-slug]
function extractSku(url: string): string {
  const match = url.match(/\/shop\/product\/([^/?#]+)/);
  if (!match) throw new Error(`Cannot extract SKU from Eden Pet Foods URL: ${url}`);
  return match[1];
}

// API returns composition fields as raw HTML strings — strip tags before use
function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return cheerio.load(html).text().trim();
}

interface EdenProductResponse {
  Ack: string;
  Response: {
    product: {
      name: string;
      display_name: string;
      attributeContent: {
        composition: string | null;
        analytical: string | null;
        nutritional: string | null;
        'trace-elements': string | null;
      };
    };
  };
}

export async function scrapeEdenPetFoods(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  const url = scrapeRequest.url;
  const logPrefix = scrapeRequest.logPrefix ?? '';
  const sku = extractSku(url);

  const { data } = await axios.post<EdenProductResponse>(
    'https://www.edenpetfoods.com/api/product-page-details',
    `sku=${encodeURIComponent(sku)}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  );

  const product = data.Response.product;
  const ac = product.attributeContent;

  const title = product.display_name?.trim() || product.name?.trim() || '';
  const ingredientsDescription = stripHtml(ac.composition);

  const compositionParts = [
    stripHtml(ac.analytical),
    stripHtml(ac.nutritional),
    stripHtml(ac['trace-elements']),
  ].filter(Boolean);
  const compositionText = compositionParts.join('\n');

  log(logPrefix, `[ai-mapper] calling AI for ${url}`);
  const mappingResult = await mapProductCompositionWithAI(compositionText, logPrefix);

  for (const note of mappingResult.notes) {
    logWarn(logPrefix, `[composition-mapper] ${note}`);
  }

  const finalIngredientsDescription = mappingResult.ingredientsDescriptionEnglish ?? ingredientsDescription;

  return {
    url,
    title,
    ingredientsDescription: finalIngredientsDescription,
    nutritionData: mappingResult.mappedSections.nutritionData as NutritionData,
    mineralsData: mappingResult.mappedSections.mineralsData as MineralsData,
    saltsData: mappingResult.mappedSections.saltsData as SaltsData,
    vitaminsData: mappingResult.mappedSections.vitaminsData as VitaminsData,
    aminoAcidsData: mappingResult.mappedSections.aminoAcidsData as AminoAcidsData,
    vitaminLikeData: mappingResult.mappedSections.vitaminLikeData as VitaminLikeData,
    fattyAcidsData: mappingResult.mappedSections.fattyAcidsData as FattyAcidsData,
    sugarAlcoholsData: mappingResult.mappedSections.sugarAlcoholsData as SugarAlcoholsData,
  };
}

