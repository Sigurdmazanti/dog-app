## Context

The scraper reads source YAML files (`scraper/sources/*.yaml`) to know which product URLs to scrape per brand. Each file lists URLs under `products.dry`, `products.wet`, `products.treats`, and `products.freeze-dried`. Currently there is no summary of how many products exist per category or in total, making it necessary to manually count to assess coverage.

## Goals / Non-Goals

**Goals:**
- Add a `productCounts` field to each source YAML with per-category counts and a total
- All 7 existing source files are updated: `acana-eu`, `acana-us`, `advance`, `almo-nature`, `amanova`, `animonda`, `zooplus`
- Counts are derived by manually counting the URL entries in each category

**Non-Goals:**
- Auto-generating or validating counts at runtime (no code changes)
- Adding counts for categories that have no URLs (empty lists remain as-is)
- Modifying the scraper runtime to read or use these counts

## Decisions

**Decision: Static embedded counts, not computed at runtime**

The counts are written directly into the YAML as static data. The alternative would be computing them dynamically in the scraper. Static data is preferred because:
- The YAML files are the source of truth for product URLs
- Counts are immediately visible without running any code
- Zero risk of breaking scraper runtime behavior (additive only)
- Simple to maintain: update count when URLs change

**Decision: Top-level `productCounts` key, mirroring `products` structure**

The counts live in a sibling `productCounts` key at the top level, with the same sub-keys as `products`. A `total` sub-key holds the sum. This keeps it easy to scan visually and consistent across all files.

## Risks / Trade-offs

- [Risk] Counts drift out of sync if URLs are added/removed without updating the count → Mitigation: Tasks include a reminder note; counts are clearly visible near the URL lists for easy manual upkeep
