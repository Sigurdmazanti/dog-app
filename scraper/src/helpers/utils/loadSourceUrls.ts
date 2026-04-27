import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { FoodType } from '../../interfaces/foodTypes';
import { UrlWithFoodType } from '../../interfaces/urlWithFoodType';

interface BrandSourceFile {
  scraper: string;
  brand: string;
  domain: string;
  products: Partial<Record<FoodType, string[]>>;
}

export function loadSourceUrls(yamlPath: string, foodType?: FoodType): UrlWithFoodType[] {
  const resolved = path.resolve(yamlPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Source file not found: ${resolved}`);
  }

  const content = fs.readFileSync(resolved, 'utf-8');
  const parsed = yaml.load(content) as BrandSourceFile;

  if (foodType) {
    return (parsed?.products?.[foodType] ?? []).map((url) => ({ url, foodType }));
  }

  const results: UrlWithFoodType[] = [];
  for (const [key, urls] of Object.entries(parsed?.products ?? {})) {
    if (urls && urls.length > 0) {
      for (const url of urls) {
        results.push({ url, foodType: key as FoodType });
      }
    }
  }
  return results;
}
