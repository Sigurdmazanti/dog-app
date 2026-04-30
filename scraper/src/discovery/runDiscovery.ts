import { FoodType } from '../interfaces/foodTypes';
import { NeedsReviewEntry } from '../interfaces/source';
import { loadSource } from '../helpers/utils/loadSource';
import { loadDiscoveryConfig } from './loadDiscoveryConfig';
import { crawlListing } from './crawlListing';
import { classifyFoodType, ClassifyOptions } from './classifyFoodType';
import { DiscoveredUrl, DiscoveryResult } from './types';

export interface RunDiscoveryOptions {
  /** Polite delay between fetches within a single source (ms, default 500). */
  delayMs?: number;
  /** Override default User-Agent for all crawler/classifier fetches. */
  userAgent?: string;
  /** OpenAI classifier options. */
  classifier?: ClassifyOptions;
}

/**
 * Run end-to-end discovery for one brand:
 *   1. Crawl every configured listing, tagging URLs with the listing's foodType.
 *   2. For URLs already in the source's `products` map but NOT produced by any
 *      listing, run the AI fallback classifier to recover their grouping.
 *   3. Carry forward existing `needsReview` entries unchanged (skip re-classify).
 */
export async function runDiscovery(
  brand: string,
  opts: RunDiscoveryOptions = {}
): Promise<DiscoveryResult> {
  const source = loadSource(brand);
  const config = loadDiscoveryConfig(brand);
  const ignore = new Set(config.ignore ?? []);

  const confidentByUrl = new Map<string, DiscoveredUrl>();
  const needsReviewByUrl = new Map<string, DiscoveredUrl>();

  // 1. Crawl listings.
  for (const listing of config.listings) {
    const urls = await crawlListing(listing, {
      productLinkSelector: config.productLinkSelector,
      pagination: config.pagination,
      delayMs: opts.delayMs,
      userAgent: opts.userAgent,
    });
    for (const url of urls) {
      if (ignore.has(url)) continue;
      // First listing wins on collision (dedupe across listings).
      if (!confidentByUrl.has(url)) {
        confidentByUrl.set(url, { url, foodType: listing.foodType, source: 'listing' });
      }
    }
  }

  // 2. Carry forward existing needsReview entries (skip re-classification).
  const carryForward = new Set<string>();
  for (const entry of source.needsReview ?? []) {
    if (ignore.has(entry.url)) continue;
    if (!confidentByUrl.has(entry.url)) {
      needsReviewByUrl.set(entry.url, {
        url: entry.url,
        source: 'needs-review',
        bestGuess: entry.bestGuess,
        confidence: entry.confidence,
        reason: entry.reason,
      });
      carryForward.add(entry.url);
    }
  }

  // 3. AI fallback for URLs in source.products that no listing produced
  //    (and aren't already carry-forward needs-review entries).
  const knownUrls = new Set<string>();
  for (const list of Object.values(source.products)) {
    for (const url of list ?? []) knownUrls.add(url);
  }
  for (const url of knownUrls) {
    if (ignore.has(url)) continue;
    if (confidentByUrl.has(url) || carryForward.has(url)) continue;
    const result = await classifyFoodType(url, opts.classifier);
    if (result.source === 'ai' && result.foodType) {
      confidentByUrl.set(url, result);
    } else {
      needsReviewByUrl.set(url, result);
    }
  }

  return {
    brand,
    confident: Array.from(confidentByUrl.values()),
    needsReview: Array.from(needsReviewByUrl.values()),
  };
}

/**
 * Convenience: build the persistable `needsReview` array from a DiscoveryResult.
 */
export function toNeedsReviewEntries(result: DiscoveryResult): NeedsReviewEntry[] {
  return result.needsReview.map((d) => ({
    url: d.url,
    bestGuess: d.bestGuess,
    confidence: d.confidence,
    reason: d.reason,
  }));
}

/**
 * Convenience: rebuild the persistable `products` map from a DiscoveryResult,
 * preserving food-type keys with empty arrays where no URLs were found.
 */
export function toProductsMap(
  result: DiscoveryResult,
  foodTypeKeys: FoodType[]
): Partial<Record<FoodType, string[]>> {
  const out: Partial<Record<FoodType, string[]>> = {};
  for (const ft of foodTypeKeys) out[ft] = [];
  for (const d of result.confident) {
    if (!d.foodType) continue;
    if (!out[d.foodType]) out[d.foodType] = [];
    out[d.foodType]!.push(d.url);
  }
  return out;
}
