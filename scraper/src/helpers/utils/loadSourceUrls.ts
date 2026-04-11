import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { FoodType } from '../../interfaces/foodTypes';

interface BrandSourceFile {
  scraper: string;
  brand: string;
  domain: string;
  products: Partial<Record<FoodType, string[]>>;
}

export function loadSourceUrls(yamlPath: string, foodType: FoodType): string[] {
  const resolved = path.resolve(yamlPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Source file not found: ${resolved}`);
  }

  const content = fs.readFileSync(resolved, 'utf-8');
  const parsed = yaml.load(content) as BrandSourceFile;

  return parsed?.products?.[foodType] ?? [];
}
