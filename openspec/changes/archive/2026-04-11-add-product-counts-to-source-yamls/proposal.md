## Why

The scraper source YAML files contain product URL lists per food type but no information about how many products exist per category or in total. This makes it hard to quickly assess coverage and spot gaps across different brands without manually counting URLs.

## What Changes

- Each source YAML file gains a `productCounts` field with per-category counts (`dry`, `wet`, `treats`, `freeze-dried`) and a `total` derived from those counts.
- All 7 source YAML files are updated: `acana-eu.yaml`, `acana-us.yaml`, `advance.yaml`, `almo-nature.yaml`, `amanova.yaml`, `animonda.yaml`, `zooplus.yaml`.

## Capabilities

### New Capabilities

- `source-yaml-product-counts`: Structured product count data embedded in each source YAML, providing per-category counts and a total count for each brand's product list.

### Modified Capabilities

<!-- No existing specs have requirement changes. -->

## Impact

- `scraper/sources/*.yaml` — all source files modified
- No code changes required; purely data/config additions
- No breaking changes to the scraper runtime (new fields are additive)
