import { FoodType } from '../interfaces/foodTypes';
import { Source } from '../interfaces/source';
import { DiscoveryResult } from '../discovery/types';

export interface AddedEntry {
  url: string;
  foodType: FoodType;
}

export interface RemovedEntry {
  url: string;
  foodType: FoodType;
}

export interface RegroupedEntry {
  url: string;
  from: FoodType;
  to: FoodType;
}

export interface NeedsReviewDiffEntry {
  url: string;
  bestGuess?: FoodType;
  confidence?: number;
  reason?: string;
}

export interface DiffReport {
  brand: string;
  added: AddedEntry[];
  removed: RemovedEntry[];
  regrouped: RegroupedEntry[];
  needsReview: NeedsReviewDiffEntry[];
}

/**
 * Build the source's URL → foodType lookup from `products`.
 * If a URL appears in two food-type groups (data error), the first wins.
 */
function buildSourceLookup(products: Source['products']): Map<string, FoodType> {
  const out = new Map<string, FoodType>();
  for (const [ft, urls] of Object.entries(products) as [FoodType, string[] | undefined][]) {
    for (const url of urls ?? []) if (!out.has(url)) out.set(url, ft);
  }
  return out;
}

/**
 * Compare a discovery result against a source's existing `products` map and
 * return the four-bucket diff (added, removed, regrouped, needsReview).
 */
export function buildDiff(source: Source, result: DiscoveryResult): DiffReport {
  const sourceLookup = buildSourceLookup(source.products);
  const discovered = new Map<string, FoodType>();
  for (const d of result.confident) {
    if (d.foodType) discovered.set(d.url, d.foodType);
  }

  const added: AddedEntry[] = [];
  const removed: RemovedEntry[] = [];
  const regrouped: RegroupedEntry[] = [];

  for (const [url, foodType] of discovered) {
    const prior = sourceLookup.get(url);
    if (prior === undefined) {
      added.push({ url, foodType });
    } else if (prior !== foodType) {
      regrouped.push({ url, from: prior, to: foodType });
    }
  }

  const needsReviewUrls = new Set(result.needsReview.map((n) => n.url));
  for (const [url, foodType] of sourceLookup) {
    if (!discovered.has(url) && !needsReviewUrls.has(url)) {
      removed.push({ url, foodType });
    }
  }

  const needsReview: NeedsReviewDiffEntry[] = result.needsReview.map((n) => ({
    url: n.url,
    bestGuess: n.bestGuess,
    confidence: n.confidence,
    reason: n.reason,
  }));

  return { brand: result.brand, added, removed, regrouped, needsReview };
}

export interface GuardResult {
  tripped: boolean;
  details: Array<{ foodType: FoodType; prior: number; discovered: number; ratio: number }>;
}

/**
 * The 50% safety guard: refuses write-back when any food type's discovered
 * URL count drops to less than half of its prior count.
 *
 * Returns `tripped: true` plus per-food-type details when violated;
 * `tripped: false` otherwise. `--force` is the operator's job at the CLI.
 */
export function evaluateGuard(source: Source, result: DiscoveryResult): GuardResult {
  const priorCounts = new Map<FoodType, number>();
  for (const [ft, urls] of Object.entries(source.products) as [FoodType, string[] | undefined][]) {
    priorCounts.set(ft, (urls ?? []).length);
  }
  const discoveredCounts = new Map<FoodType, number>();
  for (const d of result.confident) {
    if (!d.foodType) continue;
    discoveredCounts.set(d.foodType, (discoveredCounts.get(d.foodType) ?? 0) + 1);
  }

  const details: GuardResult['details'] = [];
  for (const [ft, prior] of priorCounts) {
    if (prior === 0) continue;
    const discovered = discoveredCounts.get(ft) ?? 0;
    const ratio = discovered / prior;
    if (ratio < 0.5) {
      details.push({ foodType: ft, prior, discovered, ratio });
    }
  }

  return { tripped: details.length > 0, details };
}

/**
 * Format a DiffReport as a human-readable console string.
 */
export function renderDiff(report: DiffReport): string {
  const lines: string[] = [];
  lines.push(`DISCOVERY: ${report.brand}`);

  if (report.added.length > 0 || report.needsReview.length > 0) {
    lines.push(`  Added (${report.added.length + report.needsReview.length}):`);
    for (const a of report.added) lines.push(`    + ${a.foodType}/   ${a.url}`);
    for (const n of report.needsReview) {
      const guess = n.bestGuess ? `AI: ${n.bestGuess}` : 'AI: ?';
      const conf = n.confidence !== undefined ? `, conf ${n.confidence.toFixed(2)}` : '';
      const reason = n.reason ? ` — ${n.reason}` : '';
      lines.push(`    ? unclassified  ${n.url}   (${guess}${conf}${reason})`);
    }
  }

  if (report.removed.length > 0) {
    lines.push(`  Removed (${report.removed.length}):`);
    for (const r of report.removed) lines.push(`    - ${r.foodType}/   ${r.url}`);
  }

  if (report.regrouped.length > 0) {
    lines.push(`  Re-grouped (${report.regrouped.length}):`);
    for (const r of report.regrouped) lines.push(`    ~ ${r.from} → ${r.to}  ${r.url}`);
  }

  if (
    report.added.length === 0 &&
    report.removed.length === 0 &&
    report.regrouped.length === 0 &&
    report.needsReview.length === 0
  ) {
    lines.push('  (no changes)');
  }

  return lines.join('\n');
}
