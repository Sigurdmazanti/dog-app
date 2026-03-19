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

export async function scrapeZooPlus(scrapeRequest: ScrapeRequest): Promise<ScrapeResult> {
  try {
		const url: string = scrapeRequest.url;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('h1').text();

    const fullIngredientsText = $('#ingredients .anchors_anchorsHTML___2lrv p').text();
    const split = fullIngredientsText.split('Tilsætningsstoffer');
    const ingredientsDescription = split[0]
      .replace(/^Ingredienser[:\\s]*/i, '')
      .trim();

    const compositionEntries: Array<{ name: string; valueText: string }> = [];

    $('table[data-zta="constituentsTable"] tr').each((_, el) => {
      const cells = $(el).find('td');
      if (cells.length === 2) {
        compositionEntries.push({
          name: $(cells[0]).text().toLowerCase().trim(),
          valueText: $(cells[1]).text(),
        });
      }
    });

    const mappingResult = await mapProductCompositionWithAI(compositionEntries);
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