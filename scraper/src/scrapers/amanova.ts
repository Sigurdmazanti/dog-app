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

export async function scrapeAmanova(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  try {
    const url: string = scrapeRequest.url;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const productName = $('#title-product').text().trim();
    const subtitle = $('h2.product__text').text().trim();
    const title = [productName, subtitle].filter(Boolean).join(' — ');

    const ingredientsDescription = $('.accordion__content .metafield-rich_text_field').first().text().trim();

    const componentsText = $('.accordion__content .metafield-multi_line_text_field').text().trim();

    const compositionText = [ingredientsDescription, componentsText]
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
