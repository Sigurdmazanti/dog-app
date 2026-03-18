import { NutritionData } from "../interfaces/productComposition";

/**
 * Calculates NFE (Nitrogen-Free Extract)
 * NFE = 100 - water - protein - fat - fiber - crudeAsh
 */
export function calculateNFE(data: NutritionData): number {
  return 100 - data.water - data.protein - data.fat - data.fiber - data.crudeAsh;
}

/**
 * Calculates Gross Energy (kJ)
 * Gross Energy (kJ) = (protein * 23.8) + (fat * 39.7) + (NFE * 17.9) + (fiber * 8)
 */
export function calculateGrossEnergy(data: NutritionData): number {
  const nfe = calculateNFE(data);

  const grossEnergy =
    (data.protein * 23.8) +
    (data.fat * 39.7) +
    (nfe * 17.9) +
    (data.fiber * 8);

    console.log('gross energy:' + grossEnergy);

  return Math.round(grossEnergy);
}