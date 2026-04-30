import { FoodType } from './foodTypes';

/**
 * A listing/category page on a brand's website that the discovery crawler
 * walks to find product URLs. The `foodType` here is taken as the food type
 * for every product URL extracted from this listing.
 */
export interface DiscoveryListing {
  url: string;
  foodType: FoodType;
}

/**
 * Optional pagination config for a listing-page crawl.
 * `nextSelector` is a CSS selector matching the "next page" anchor.
 * `maxPages` caps the crawl per listing (default applied by the crawler).
 */
export interface DiscoveryPagination {
  nextSelector: string;
  maxPages?: number;
}

/**
 * Per-source declarative discovery config. Tells the shared crawler how to
 * walk the brand's category pages. Empty/missing means discovery is not yet
 * configured for this brand.
 */
export interface DiscoveryConfig {
  listings: DiscoveryListing[];
  productLinkSelector: string;
  pagination?: DiscoveryPagination;
  /**
   * Exact URLs to drop from discovery output (e.g. cross-sell items, promo
   * tiles, or non-product links the selector accidentally matches). Applied
   * after listing crawl AND AI fallback, so an ignored URL never appears in
   * the diff or in `needsReview`.
   */
  ignore?: string[];
}

/**
 * A URL the discovery step could not confidently classify into a food type,
 * persisted in the source file across runs so it isn't re-classified
 * (and re-billed to OpenAI) every run.
 */
export interface NeedsReviewEntry {
  url: string;
  bestGuess?: FoodType;
  confidence?: number;
  reason?: string;
}

/**
 * Per-brand source file at `scraper/sources/<brand>.json`.
 * Replaces the legacy YAML format.
 */
export interface Source {
  scraper: string;
  brand: string;
  domain: string;
  discovery?: DiscoveryConfig;
  products: Partial<Record<FoodType, string[]>>;
  needsReview?: NeedsReviewEntry[];
}
