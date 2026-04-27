## Context

The `calibra-scraper` change delivered a working scraper module targeting `mycalibra.eu` and created a stub `calibra.yaml` with empty product lists. When the actual product catalogue was researched, all live product pages were found at `calibrastore.co.uk` — a UK regional Shopify storefront for the same brand. Both domains run the same Shopify theme and accordion layout, so the existing selectors need no changes. This change fills in the product URLs and corrects the domain string in both the source YAML and the source registry.

## Goals / Non-Goals

**Goals:**
- Set `domain: calibrastore.co.uk` in `calibra.yaml` and update the source registry dispatch key to match
- Populate `calibra.yaml` with 77 dry, 29 wet, and 38 unique treats URLs (one duplicate removed)
- Set `productCounts` in `calibra.yaml` to reflect the populated lists

**Non-Goals:**
- Changing any scraper selector logic — the existing selectors work on `calibrastore.co.uk`
- Scraping `mycalibra.eu` — no live product pages were found there
- Discovering additional freeze-dried, misc, or barf URLs — none found in the catalogue

## Decisions

### Domain: calibrastore.co.uk over mycalibra.eu

**Decision**: Use `calibrastore.co.uk` as the canonical domain.

The original change assumed `mycalibra.eu` based on the brand's EU-facing domain, but the actual product catalogue accessible for scraping is at `calibrastore.co.uk`. The source registry match string and `calibra.yaml` `domain` field are both updated.

*Alternative considered*: Keeping `mycalibra.eu` and adding a second registry entry for `calibrastore.co.uk`. Rejected — there is no evidence of any scrapeable product on `mycalibra.eu`, so maintaining two entries would be misleading.

### Duplicate URL removal

One URL (`calibra-joy-dog-classic-fish-chicken-sandwich`) appeared twice in the treats list. The duplicate is removed, leaving 38 unique treat URLs.

**Decision**: De-duplicate silently (no comment in YAML). The source YAML is a clean data file; duplicates offer no value.

## Risks / Trade-offs

- **calibrastore.co.uk selector drift** → The site runs the same Shopify theme as mycalibra.eu. If Calibra updates the UK storefront independently, selectors could diverge. Mitigation: `calibra.selectors.md` documents the stable selectors; a scraper run will surface failures promptly.
- **Incomplete catalogue** → The 144-product list was gathered from paginated collection pages and may miss products added after this date. Mitigation: acceptable — the source YAML is a plain text file and can be updated at any time.
