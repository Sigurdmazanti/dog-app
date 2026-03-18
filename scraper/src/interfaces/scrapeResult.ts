import { NutritionData, MineralsData } from "./productComposition";

export interface ScrapeResult {
  url: string;
  title: string;
  ingredientsDescription: string;
  nutritionData: NutritionData;
  mineralsData: MineralsData;
}

export interface ScrapeDataRow extends ScrapeResult {
  foodType: string;
  noteText: string;
}