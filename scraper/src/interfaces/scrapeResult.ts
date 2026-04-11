import {
  AminoAcidsData,
  FattyAcidsData,
  MineralsData,
  NutritionData,
  SaltsData,
  SugarAlcoholsData,
  VitaminLikeData,
  VitaminsData,
} from "./productComposition";
import { FoodType } from "./foodTypes";

export interface ScrapeResult {
  url: string;
  title: string;
  ingredientsDescription: string;
  nutritionData: NutritionData;
  mineralsData: MineralsData;
  saltsData: SaltsData;
  vitaminsData: VitaminsData;
  aminoAcidsData: AminoAcidsData;
  vitaminLikeData: VitaminLikeData;
  fattyAcidsData: FattyAcidsData;
  sugarAlcoholsData: SugarAlcoholsData;
}

export interface ScrapeDataRow extends ScrapeResult {
  foodType: FoodType;
  noteText: string;
  dataSource: string;
  brand: string;
}