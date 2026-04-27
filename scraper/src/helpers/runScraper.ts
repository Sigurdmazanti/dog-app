import axios from "axios";
import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
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
import { mapProductCompositionWithAI } from './composition/aiProductCompositionMapper';
import { log, logWarn } from './utils/logger';

export interface ScraperExtractors {
  extractTitle: ($: CheerioAPI) => string;
  extractIngredientsDescription: ($: CheerioAPI) => string;
  extractCompositionText: ($: CheerioAPI, ingredientsDescription: string) => string;
}

export async function runScraper(scrapeRequest: ScrapeRequest, extractors: ScraperExtractors): Promise<ScrapeResult> {
  const url = scrapeRequest.url;
  const logPrefix = scrapeRequest.logPrefix ?? '';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const title = extractors.extractTitle($);
  const ingredientsDescription = extractors.extractIngredientsDescription($);
  const compositionText = extractors.extractCompositionText($, ingredientsDescription);

  log(logPrefix, `[ai-mapper] calling AI for ${url}`);
  const mappingResult = await mapProductCompositionWithAI(compositionText, logPrefix);

  for (const note of mappingResult.notes) {
    logWarn(logPrefix, `[composition-mapper] ${note}`);
  }

  const finalIngredientsDescription = mappingResult.ingredientsDescriptionEnglish ?? ingredientsDescription;

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
    ingredientsDescription: finalIngredientsDescription,
    nutritionData,
    mineralsData,
    saltsData,
    vitaminsData,
    aminoAcidsData,
    vitaminLikeData,
    fattyAcidsData,
    sugarAlcoholsData,
  };
}
