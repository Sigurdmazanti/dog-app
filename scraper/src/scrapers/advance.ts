import axios from "axios";
import * as cheerio from 'cheerio';
import { ScrapeResult } from "../interfaces/scrapeResult";
import {
  AminoAcidsData,
  FattyAcidsData,
  MineralsData,
  NutritionData,
  SaltsData,
  SugarAlcoholsData,
  VitaminLikeData,
  VitaminsData,
} from "../interfaces/productComposition";
import { ScrapeRequest } from "../interfaces/scrapeRequest";
import { mapProductCompositionWithAI } from '../helpers/aiProductCompositionMapper';

export async function scrapeAdvance(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  try {
    const url: string = scrapeRequest.url;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('h1.product-title').text().trim();

    const ingredientsDescription = $('.ings-content .metafield-rich_text_field').text().trim();

    const analysisLines: string[] = [];
    $('.nutritional-table table tr').each((_, el) => {
      const cells = $(el).find('td');
      if (cells.length === 2) {
        const label = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        if (label && value) {
          analysisLines.push(`${label}: ${value}`);
        }
      }
    });

    const compositionText = [ingredientsDescription, analysisLines.join('; ')]
      .filter((value) => value.trim().length > 0)
      .join('\n');

    const mappingResult = await mapProductCompositionWithAI(compositionText);

    for (const note of mappingResult.notes) {
      console.warn(`[composition-mapper] ${note}`);
    }

    const nutritionData = mappingResult.mappedSections.nutritionData as NutritionData;
    const mineralsData = mappingResult.mappedSections.mineralsData as MineralsData;
    const saltsData = mappingResult.mappedSections.saltsData as SaltsData;
    const vitaminsData = mappingResult.mappedSections.vitaminsData as VitaminsData;
    const aminoAcidsData = mappingResult.mappedSections.aminoAcidsData as AminoAcidsData;
    const vitaminLikeData = mappingResult.mappedSections.vitaminLikeData as VitaminLikeData;
    const fattyAcidsData = mappingResult.mappedSections.fattyAcidsData as FattyAcidsData;
    const sugarAlcoholsData = mappingResult.mappedSections.sugarAlcoholsData as SugarAlcoholsData;

    return {
      url,
      title,
      ingredientsDescription,
      nutritionData,
      mineralsData,
      saltsData,
      vitaminsData,
      aminoAcidsData,
      vitaminLikeData,
      fattyAcidsData,
      sugarAlcoholsData,
    };

  } catch (err) {
    throw err;
  }
}
