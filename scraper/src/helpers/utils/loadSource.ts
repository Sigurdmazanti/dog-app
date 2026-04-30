import * as fs from 'fs';
import * as path from 'path';
import { FoodType } from '../../interfaces/foodTypes';
import { Source } from '../../interfaces/source';

const SOURCES_DIR = path.resolve(__dirname, '../../../sources');
const ALLOWED_FOOD_TYPES = new Set<string>(Object.values(FoodType));

/**
 * Load and validate a brand's source JSON file.
 *
 * Looks up `scraper/sources/<brand>.json`, parses it, and validates the
 * required schema (`scraper`, `brand`, `domain`, `products`). Any URL inside
 * `products` must be absolute. Legacy `productCounts` keys (from the old YAML
 * era) are silently ignored.
 */
export function loadSource(brand: string): Source {
  const sourcePath = path.join(SOURCES_DIR, `${brand}.json`);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(
      `Source file not found for brand "${brand}" — expected ${sourcePath}`,
    );
  }

  const raw = fs.readFileSync(sourcePath, 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Source file ${sourcePath} is not valid JSON: ${(err as Error).message}`,
    );
  }

  return validateSource(parsed, sourcePath);
}

/**
 * Load a source by JSON file path (for callers that already have the path,
 * e.g. the legacy `--urls <file>` CLI flag).
 */
export function loadSourceFromPath(sourcePath: string): Source {
  const resolved = path.resolve(sourcePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Source file not found: ${resolved}`);
  }
  const raw = fs.readFileSync(resolved, 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Source file ${resolved} is not valid JSON: ${(err as Error).message}`,
    );
  }
  return validateSource(parsed, resolved);
}

function validateSource(parsed: unknown, sourcePath: string): Source {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`Source file ${sourcePath} must be a JSON object`);
  }
  const obj = parsed as Record<string, unknown>;

  for (const field of ['scraper', 'brand', 'domain']) {
    if (typeof obj[field] !== 'string' || !(obj[field] as string).length) {
      throw new Error(
        `Source file ${sourcePath} is missing required string field "${field}"`,
      );
    }
  }

  if (!obj.products || typeof obj.products !== 'object' || Array.isArray(obj.products)) {
    throw new Error(
      `Source file ${sourcePath} is missing required object field "products"`,
    );
  }

  const products = obj.products as Record<string, unknown>;
  for (const [foodType, urls] of Object.entries(products)) {
    if (!ALLOWED_FOOD_TYPES.has(foodType)) {
      throw new Error(
        `Source file ${sourcePath} has unknown food type "${foodType}" in products`,
      );
    }
    if (!Array.isArray(urls)) {
      throw new Error(
        `Source file ${sourcePath} products.${foodType} must be an array`,
      );
    }
    for (const url of urls) {
      if (typeof url !== 'string' || !/^https?:\/\//.test(url)) {
        throw new Error(
          `Source file ${sourcePath} products.${foodType} contains non-absolute URL: ${String(url)}`,
        );
      }
    }
  }

  // Discard legacy productCounts silently — it's no longer part of the schema.
  delete obj.productCounts;

  return obj as unknown as Source;
}

/**
 * Derive a product count from a source. Counts are NOT stored in the source
 * file; they're computed on demand.
 */
export function getProductCount(source: Source, foodType?: FoodType): number {
  if (foodType) {
    return source.products[foodType]?.length ?? 0;
  }
  return Object.values(source.products)
    .filter((arr): arr is string[] => Array.isArray(arr))
    .reduce((sum, arr) => sum + arr.length, 0);
}
