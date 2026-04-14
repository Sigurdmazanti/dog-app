## Context

`barfworld.yaml` exists with the correct structure (categories, `productCounts`) but all product lists are empty. The barfworld scraper implementation is already complete. This change purely populates the YAML with 32 known product URLs across four categories.

## Goals / Non-Goals

**Goals:**
- Populate `products.misc`, `products.treats`, `products.barf`, and `products.freeze-dried` with their respective URLs
- Keep `productCounts` in sync with the number of URLs per category

**Non-Goals:**
- Changes to scraper code or selectors
- Adding new categories
- Validating or scraping any of the URLs

## Decisions

**Direct YAML population over scripted import**: The URLs are a known, finite list provided directly by the user. Writing them inline in the YAML is simpler and consistent with how every other source YAML in the project is maintained. No tooling is needed.

**productCounts updated manually**: Per the `source-yaml-product-counts` spec, counts must match list lengths. With a small, static list this is calculated once at write time — misc: 1, treats: 16, barf: 10, freeze-dried: 5, total: 32.

## Risks / Trade-offs

- [Stale count] If URLs are added or removed later without updating `productCounts`, the counts will drift → Mitigation: counts must be updated whenever the URL lists change (enforced by spec)
