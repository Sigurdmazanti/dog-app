import { FoodType } from '../../interfaces/foodTypes';

export const defaultWaterByFoodType: Partial<Record<FoodType, number>> = {
  [FoodType.Wet]: 80,
  [FoodType.Dry]: 9,
  [FoodType.Misc]: 0,
  [FoodType.Barf]: 0,
};

export function getDefaultWaterAmount(foodType: FoodType): number {
  return defaultWaterByFoodType[foodType] ?? 0;
}
