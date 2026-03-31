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

export async function scrapeAlmoNature(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  try {
    const url: string = scrapeRequest.url;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const category = $('span.product-category').text().trim();
    const flavor = $('span.product-flavor').text().trim();
    const title = [category, flavor].filter(Boolean).join(' ');

    const ingredientsDescription = $('#composition').text().trim();

    const constituentsLines: string[] = [];
    $('#constituents ul li').each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        constituentsLines.push(text);
      }
    });

    const additivesText = $('.Product__additives').text().trim();

    const compositionText = [ingredientsDescription, constituentsLines.join('; '), additivesText]
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
