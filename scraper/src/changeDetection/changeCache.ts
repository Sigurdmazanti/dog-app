import * as fs from 'fs';
import * as path from 'path';
import { ScrapeResult } from '../interfaces/scrapeResult';
import { hashProduct } from './hashProduct';

const CACHE_DIR = path.resolve(__dirname, '../../.cache');

/** URL → SHA-256 hash. */
export type HashCache = Record<string, string>;

function cachePath(brand: string): string {
  return path.join(CACHE_DIR, `${brand}.hashes.json`);
}

/**
 * Load the previous run's hash cache for a brand.
 * Treats a missing file (or unreadable JSON) as an empty cache so the
 * cache is non-fatal and self-healing.
 */
export function loadHashCache(brand: string): HashCache {
  const file = cachePath(brand);
  if (!fs.existsSync(file)) return {};
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: HashCache = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'string') out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

/** Persist a brand's hash cache to disk, creating the cache dir if needed. */
export function saveHashCache(brand: string, cache: HashCache): void {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath(brand), JSON.stringify(cache, null, 2) + '\n');
}

export type ChangeStatus = 'new' | 'changed' | 'unchanged' | 'removed';

export interface ChangeEntry {
  url: string;
  status: ChangeStatus;
  previousHash?: string;
  currentHash?: string;
}

export interface ChangeSummary {
  brand: string;
  entries: ChangeEntry[];
  counts: Record<ChangeStatus, number>;
}

/**
 * Build the per-URL change classification for a batch run by comparing the
 * cached hashes against this run's products.
 *
 * Statuses:
 *  - new       : URL not in previous cache
 *  - unchanged : URL in previous cache, hash matches
 *  - changed   : URL in previous cache, hash differs (previous + current hash returned)
 *  - removed   : URL in previous cache, NOT in this run's results
 */
export function buildChangeSummary(
  brand: string,
  previous: HashCache,
  currentRunProducts: ScrapeResult[]
): ChangeSummary {
  const counts: Record<ChangeStatus, number> = { new: 0, changed: 0, unchanged: 0, removed: 0 };
  const entries: ChangeEntry[] = [];
  const currentUrls = new Set<string>();

  for (const product of currentRunProducts) {
    const url = product.url;
    currentUrls.add(url);
    const currentHash = hashProduct(product);
    const previousHash = previous[url];
    if (previousHash === undefined) {
      entries.push({ url, status: 'new', currentHash });
      counts.new += 1;
    } else if (previousHash === currentHash) {
      entries.push({ url, status: 'unchanged', previousHash, currentHash });
      counts.unchanged += 1;
    } else {
      entries.push({ url, status: 'changed', previousHash, currentHash });
      counts.changed += 1;
    }
  }

  for (const url of Object.keys(previous)) {
    if (!currentUrls.has(url)) {
      entries.push({ url, status: 'removed', previousHash: previous[url] });
      counts.removed += 1;
    }
  }

  return { brand, entries, counts };
}

/**
 * Build the next persistable cache: every URL in this run gets its current hash.
 * URLs not in this run are dropped (matches `removed` semantics in the summary).
 */
export function buildCacheFromRun(currentRunProducts: ScrapeResult[]): HashCache {
  const out: HashCache = {};
  for (const p of currentRunProducts) out[p.url] = hashProduct(p);
  return out;
}

/** Render a ChangeSummary as a human-readable console string. */
export function renderChangeSummary(summary: ChangeSummary): string {
  const { counts } = summary;
  const lines: string[] = [];
  lines.push(`CHANGES: ${summary.brand}`);
  lines.push(
    `  new: ${counts.new}, changed: ${counts.changed}, ` +
      `unchanged: ${counts.unchanged}, removed: ${counts.removed}`
  );
  for (const e of summary.entries) {
    if (e.status === 'unchanged') continue;
    if (e.status === 'changed') {
      lines.push(`  ~ ${e.url}  (${e.previousHash?.slice(0, 8)} → ${e.currentHash?.slice(0, 8)})`);
    } else if (e.status === 'new') {
      lines.push(`  + ${e.url}`);
    } else {
      lines.push(`  - ${e.url}`);
    }
  }
  return lines.join('\n');
}
