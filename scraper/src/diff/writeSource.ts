import * as fs from 'fs';
import * as path from 'path';
import { FoodType } from '../interfaces/foodTypes';
import { Source } from '../interfaces/source';
import { loadSourceFromPath } from '../helpers/utils/loadSource';
import { DiffReport } from './buildDiff';
import { DiscoveryResult } from '../discovery/types';

const SOURCES_DIR = path.resolve(__dirname, '../../sources');

function sourcePath(brand: string): string {
  return path.join(SOURCES_DIR, `${brand}.json`);
}

/**
 * Apply a diff back to a source JSON file. Mutations to `products`:
 *   - `added`: append URL to the target food-type list (creating the key if missing)
 *   - `removed`: drop URL from its prior food-type list
 *   - `regrouped`: drop URL from `from` list and append to `to` list
 * The `needsReview` array is REPLACED with `result.needsReview` (not merged) —
 * carry-forward of prior needs-review entries is the discovery orchestrator's job.
 *
 * The write is atomic: data is written to a sibling tmp file then renamed,
 * so a failed write never leaves a corrupt file on disk.
 */
export function applyDiffToSource(
  brand: string,
  diff: DiffReport,
  result: DiscoveryResult
): void {
  const file = sourcePath(brand);
  const source = loadSourceFromPath(file);

  // Mutate products in-place on a working copy.
  const products: Partial<Record<FoodType, string[]>> = {};
  for (const [ft, urls] of Object.entries(source.products) as [FoodType, string[] | undefined][]) {
    products[ft] = [...(urls ?? [])];
  }

  const dropFrom = (ft: FoodType, url: string) => {
    const list = products[ft];
    if (!list) return;
    const idx = list.indexOf(url);
    if (idx >= 0) list.splice(idx, 1);
  };
  const appendTo = (ft: FoodType, url: string) => {
    if (!products[ft]) products[ft] = [];
    if (!products[ft]!.includes(url)) products[ft]!.push(url);
  };

  for (const r of diff.removed) dropFrom(r.foodType, r.url);
  for (const r of diff.regrouped) {
    dropFrom(r.from, r.url);
    appendTo(r.to, r.url);
  }
  for (const a of diff.added) appendTo(a.foodType, a.url);

  const updated: Source = {
    ...source,
    products,
    needsReview: result.needsReview.map((n) => ({
      url: n.url,
      bestGuess: n.bestGuess,
      confidence: n.confidence,
      reason: n.reason,
    })),
  };

  writeSourceAtomic(file, updated);
}

/**
 * Write a Source object to disk atomically (tmp file + rename).
 * Preserves the canonical formatting: `JSON.stringify(obj, null, 2) + '\n'`.
 */
export function writeSourceAtomic(file: string, source: Source): void {
  const json = JSON.stringify(source, null, 2) + '\n';
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, json);
  fs.renameSync(tmp, file);
}
