import { FoodType } from '../../interfaces/foodTypes';

export const defaultWaterByFoodType: Partial<Record<FoodType, number>> = {
  [FoodType.Wet]: 80,
  [FoodType.Dry]: 9,
};

export function getDefaultWaterAmount(foodType: FoodType): number {
  return defaultWaterByFoodType[foodType] ?? 0;
}
