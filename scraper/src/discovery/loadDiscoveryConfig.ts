import { loadSource } from '../helpers/utils/loadSource';
import { DiscoveryConfig } from '../interfaces/source';

/**
 * Read a brand's discovery config and validate it is filled in.
 * Throws a descriptive error when the source has no discovery block,
 * an empty `listings` array, or an empty `productLinkSelector`.
 */
export function loadDiscoveryConfig(brand: string): DiscoveryConfig {
  const source = loadSource(brand);
  const d = source.discovery;
  if (!d || !Array.isArray(d.listings) || d.listings.length === 0 || !d.productLinkSelector) {
    throw new Error(
      `Source "${brand}" has no discovery config. ` +
        `Fill in scraper/sources/${brand}.json -> discovery.listings (at least one) ` +
        `and discovery.productLinkSelector before running discovery.`
    );
  }
  return d;
}
