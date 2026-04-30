import { createHash } from 'crypto';
import { ScrapeResult } from '../interfaces/scrapeResult';

/**
 * Normalise a string for hashing: trim, normalise line endings, collapse
 * runs of internal whitespace to single spaces. Returns empty string for
 * undefined/null inputs.
 */
export function normaliseHashField(value: unknown): string {
  if (value === undefined || value === null) return '';
  const s = typeof value === 'string' ? value : String(value);
  return s
    .replace(/\r\n?/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Stable JSON for an object: sorted keys at every depth. */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return (
    '{' +
    keys.map((k) => JSON.stringify(k) + ':' + stableStringify(obj[k])).join(',') +
    '}'
  );
}

/**
 * Compute a stable SHA-256 hash representing a product's content.
 * Covers: normalised title, normalised ingredients description, and the
 * structured composition/nutrition payload (stable-JSON, key-sorted).
 *
 * Cosmetic whitespace differences in title/ingredients do NOT change the
 * hash; substantive changes to any field do.
 */
export function hashProduct(product: ScrapeResult): string {
  const payload = [
    normaliseHashField(product.title),
    normaliseHashField(product.ingredientsDescription),
    stableStringify(product.nutritionData ?? {}),
    stableStringify(product.mineralsData ?? {}),
    stableStringify(product.saltsData ?? {}),
    stableStringify(product.vitaminsData ?? {}),
    stableStringify(product.aminoAcidsData ?? {}),
    stableStringify(product.vitaminLikeData ?? {}),
    stableStringify(product.fattyAcidsData ?? {}),
    stableStringify(product.sugarAlcoholsData ?? {}),
  ].join('\n');

  return createHash('sha256').update(payload, 'utf8').digest('hex');
}
