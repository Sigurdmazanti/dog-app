## Why

The `barfworld.yaml` source file was scaffolded but left with empty product lists across all categories. These 32 product URLs are now known and need to be registered so the scraper can process Barf World products.

## What Changes

- Add 1 URL to `products.misc` in `barfworld.yaml`
- Add 16 URLs to `products.treats` in `barfworld.yaml`
- Add 10 URLs to `products.barf` in `barfworld.yaml`
- Add 5 URLs to `products.freeze-dried` in `barfworld.yaml`
- Update `productCounts` in `barfworld.yaml` to reflect the new totals

## Capabilities

### New Capabilities

<!-- None — this change only populates existing structure -->

### Modified Capabilities

- `barfworld-scraper`: Populating product URL lists across misc, treats, barf, and freeze-dried categories; no change to scraping behaviour or selectors

## Impact

- `scraper/sources/barfworld.yaml` — sole file modified
- No code changes required; scraper implementation is unchanged
- `productCounts` fields must stay in sync with the URL list lengths
