import * as path from 'path';
import { FoodType } from '../../interfaces/foodTypes';
import { UrlWithFoodType } from '../../interfaces/urlWithFoodType';
import { loadSourceFromPath } from './loadSource';

/**
 * Legacy entry-point kept for back-compat with the existing `--urls` CLI:
 * loads a brand source JSON file and flattens it into the
 * `UrlWithFoodType[]` shape the batch runner expects.
 */
export function loadSourceUrls(jsonPath: string, foodType?: FoodType): UrlWithFoodType[] {
  if (jsonPath.endsWith('.yaml') || jsonPath.endsWith('.yml')) {
    throw new Error(
      `Source files are JSON now. Pass ${path.basename(jsonPath, path.extname(jsonPath))}.json instead of ${path.basename(jsonPath)}.`,
    );
  }

  const source = loadSourceFromPath(jsonPath);

  if (foodType) {
    return (source.products[foodType] ?? []).map((url) => ({ url, foodType }));
  }

  const results: UrlWithFoodType[] = [];
  for (const [key, urls] of Object.entries(source.products)) {
    if (urls && urls.length > 0) {
      for (const url of urls) {
        results.push({ url, foodType: key as FoodType });
      }
    }
  }
  return results;
}
