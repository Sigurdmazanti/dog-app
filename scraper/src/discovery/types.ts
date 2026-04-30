import { FoodType } from '../interfaces/foodTypes';

/**
 * Where a discovered URL's food type came from.
 *  - `listing` : extracted from a configured listing page (high confidence)
 *  - `ai`      : classified by the OpenAI fallback (confidence ≥ threshold)
 *  - `needs-review` : ungrouped or low-confidence; persists in source `needsReview`
 */
export type DiscoverySource = 'listing' | 'ai' | 'needs-review';

/**
 * A single URL produced by a discovery run.
 * `foodType` is undefined when `source === 'needs-review'`.
 */
export interface DiscoveredUrl {
  url: string;
  foodType?: FoodType;
  source: DiscoverySource;
  confidence?: number;
  bestGuess?: FoodType;
  reason?: string;
}

/**
 * Aggregate output of a discovery run for one brand.
 * - `confident` is everything with a `foodType` (listing + AI).
 * - `needsReview` is the set persisted back into the source file.
 */
export interface DiscoveryResult {
  brand: string;
  confident: DiscoveredUrl[];
  needsReview: DiscoveredUrl[];
}
