
/**
 * Recursively checks for missing, empty, or zero values in an object and logs a warning for each.
 * @param obj The object to check (e.g., ScrapeResult)
 * @param context Optional string to include in the warning (e.g., URL)
 * @param parentKey Used internally for nested keys
 */

import { ScrapeResult } from '../interfaces/scrapeResult';

export function checkMissingFields(result: ScrapeResult): string[] {
  const warnings: string[] = [];

  if (!result.url) {
    const msg = 'URL mangler eller er tom.';
    warnings.push(msg);
    console.warn(msg);
  }
  if (!result.title) {
    const msg = 'Titel mangler eller er tom.';
    warnings.push(msg);
    console.warn(msg);
  }
  if (!result.ingredientsDescription) {
    const msg = 'Ingrediensbeskrivelsen mangler eller er tom.';
    warnings.push(msg);
    console.warn(msg);
  }
  if (!result.nutritionData) {
    const msg = 'Analytiske bestanddele mangler.';
    warnings.push(msg);
    console.warn(msg);
  } else {
    if (!result.nutritionData.protein) {
      const msg = 'Råprotein mangler, er tom eller 0.';
      warnings.push(msg);
      console.warn(msg);
    }
    if (!result.nutritionData.fat) {
      const msg = 'Råfedt mangler, er tom eller 0.';
      warnings.push(msg);
      console.warn(msg);
    }
    if (!result.nutritionData.fiber) {
      const msg = 'Råfibre mangler, er tom eller 0.';
      warnings.push(msg);
      console.warn(msg);
    }
    if (!result.nutritionData.crudeAsh) {
      const msg = 'Råaske mangler, er tom eller 0.';
      warnings.push(msg);
      console.warn(msg);
    }
  }

  return warnings;
}