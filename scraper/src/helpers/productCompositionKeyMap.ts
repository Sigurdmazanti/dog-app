import { MineralsData, NutritionData } from "../interfaces/productComposition";

export const nutritionKeyMap: Record<keyof NutritionData, string[]> = {
  kiloJoule: ['kilojoule'/*, 'kj', 'energi', 'gross energy'*/],
  water: ['moisture', 'vand', 'fugtighed', 'væske', 'water'],
  protein: ['protein', 'råprotein', 'crude protein'],
  fat: ['fat', 'fedt', 'råfedt', 'crude fat'],
  fiber: ['fibre', 'fiber', 'råfibre', 'træstof', 'crude fibre'],
  crudeAsh: ['ash', 'råaske', 'aske', 'crude ash'],
  nfe: ['nfe', 'carbohydrates', 'kulhydrater', 'carbohydrate', 'kulhydrat']
};

export const mineralsKeyMap: Record<keyof MineralsData, string[]> = {
  calcium: ['calcium', 'kalcium', 'kalk', 'ca', 'calcium carbonate', 'calciumkarbonat'],
  phosphorus: ['phosphorus', 'phosphor', 'fosfor', 'phosphate', 'fosfat'],
  magnesium: ['magnesium', 'mg'],
  sodium: ['sodium', 'natrium', 'salt', 'na', 'sodium chloride', 'natriumklorid'],
  potassium: ['potassium', 'kalium', 'potassium chloride', 'kaliumklorid'],
};