import { FoodType } from "./foodTypes";

export interface ScrapeRequest {
  url: string;
  foodType: FoodType;
  logPrefix?: string;
}