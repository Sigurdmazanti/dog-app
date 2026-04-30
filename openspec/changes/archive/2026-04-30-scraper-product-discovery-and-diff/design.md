## Context

The Node CLI scraper in `scraper/` is driven by hand-curated source YAML files (`scraper/sources/<brand>.yaml`) that list product URLs grouped under food-type keys (`dry`, `wet`, `treats`, `freeze-dried`, `misc`, `barf`). The runner (`scraper/src/helpers/runScraper.ts`) takes those URLs, fetches each product page, runs per-brand selectors, and exports the result. Loading the YAML lives in `scraper/src/helpers/utils/loadSourceUrls.ts`, and `scraper/src/scraper.ts` accepts `--urls <file.yaml>` for batch input.

Today the URL list is a static snapshot. Maintenance happens by a human re-reading the brand's website. There are ~40+ sources and growing. The user has flagged two concrete fears:

1. **Catalogue drift** — new products are added or old ones removed without us knowing.
2. **Silent product changes** — composition or analytical constituents get reformulated; we re-scrape but don't notice the values changed.

Separately, the user confirmed they don't actually hand-edit the source YAML files, which removes the original justification for YAML (human-readable, supports comments). The format choice is now driven entirely by *machine* needs: cheap to read, cheap to rewrite, no parser dependencies, deterministic diffs.

The scraper is a separate project from the React Native app — uses `npm`, not `yarn`. It already has `axios`, `cheerio`, `openai` available, plus `js-yaml` (which this change removes).

## Goals / Non-Goals

**Goals:**
- Replace the YAML source format with a single JSON file per brand (`scraper/sources/<brand>.json`) covering both human-authored config (brand metadata, discovery rules) and machine-managed data (`products` URL map).
- Make refreshing a source's product URL list a single CLI command.
- Derive food-type grouping from the brand's own listing pages whenever possible.
- Provide a deterministic AI fallback only for URLs the listing crawl cannot classify.
- Surface a clear human-reviewable diff (added / removed / re-grouped) before any source file is mutated.
- Detect when a *known* product's content has changed between runs.
- Migrate all existing source YAMLs in one shot so there's no dual-format era.

**Non-Goals:**
- Auto-merging discovery diffs without review (write-back is opt-in via `--write`).
- Replacing the existing per-brand scraper modules — discovery is a separate phase that runs *before* scraping.
- Detecting changes to website *structure* (selectors breaking) — that's an existing scraper concern.
- Cross-source deduplication or canonical product identity across brands.
- Supporting both YAML and JSON in parallel during a transition window.
- Any UI / mobile-app change.

## Decisions

### Decision 1: One JSON file per brand, replacing YAML

`scraper/sources/<brand>.json` becomes the single source of truth per brand. Shape:

```jsonc
{
  "scraper": "canex",
  "brand": "Canex",
  "domain": "canex-shop.dk",
  "discovery": {
    "listings": [
      { "url": "https://canex-shop.dk/produkt-kategori/toerfoder/", "foodType": "dry" },
      { "url": "https://canex-shop.dk/produkt-kategori/godbidder/", "foodType": "treats" }
    ],
    "productLinkSelector": "a.woocommerce-LoopProduct-link",
    "pagination": { "nextSelector": "a.next.page-numbers", "maxPages": 20 }
  },
  "products": {
    "dry": ["https://canex-shop.dk/produkter/adult-brocks-12-kg/"],
    "treats": ["https://canex-shop.dk/produkter/canex-salmon-godbidder-250-g/"]
  },
  "needsReview": []
}
```

**Why over alternatives:**
- *Keep YAML, add `eemeli/yaml` for safe round-trip*: rejected — pulls in a dependency to solve a problem we created (machine-rewriting human-format files). The user confirmed they don't hand-edit the YAML, so the human-format premise is gone.
- *Split into two files (human config + machine products)*: rejected per user direction. Simpler is better; the file isn't large and JSON tooling handles partial reads/writes fine.
- *One mega-file for all brands*: rejected per user direction. Per-brand files keep PR diffs scoped and avoid lock contention if discovery is ever parallelised across brands.
- *TypeScript modules (`<brand>.ts`)*: rejected — writing back from a tool would require AST manipulation, which is worse than rewriting JSON.

`productCounts` is dropped. Anywhere existing code consumes counts, it computes them from `products` on the fly: `Object.values(source.products).flat().length`.

### Decision 2: Declarative discovery config inside the source JSON

The `discovery` block above is interpreted by a single shared crawler (`scraper/src/discovery/runDiscovery.ts`) that walks each listing, follows pagination, extracts product links via `productLinkSelector`, and tags each discovered URL with the listing's `foodType`. No bespoke per-brand discovery code; brands that genuinely need code can register a custom discovery function in a follow-up change.

### Decision 3: AI grouping fallback is bounded and explicit

After the crawler runs, any URL appearing in the source JSON's existing `products` lists but *not* discovered, or any URL discovered without a confident `foodType`, goes to a fallback classifier in `scraper/src/discovery/classifyFoodType.ts`. The classifier:

- Fetches the product page.
- Sends title + breadcrumbs + first paragraph to OpenAI with the fixed food-type vocabulary as the allowed labels.
- Requires a confidence above a threshold (default `0.8`) — anything below is reported as `needs-review` and is **never** auto-grouped.

### Decision 4: Discovery output is a diff report; write-back is opt-in and trivial

`npm run discover -- --source <brand>` produces a structured diff against the existing JSON:

```
DISCOVERY: canex
  Added (3):
    + dry/   https://canex-shop.dk/produkter/adult-grainfree-fish-12-kg/
    + treats/https://canex-shop.dk/produkter/canex-tuna-godbidder-250g/
    ? unclassified  https://canex-shop.dk/produkter/special-edition-bag/   (AI: dry, conf 0.62 — needs-review)
  Removed (1):
    - dry/   https://canex-shop.dk/produkter/adult-brocks-mini-3-kg/
  Re-grouped (1):
    ~ misc → treats  https://canex-shop.dk/produkter/canex-chew-bone/
```

Adding `--write` mutates the JSON. Because the file is JSON, write-back is `JSON.parse` → mutate the object → `JSON.stringify(obj, null, 2)` → write. No comment preservation, no key-order trickery, no extra dependency. `needs-review` entries are written into the top-level `needsReview` array (not into `products`) so reviewers can find them later without losing them across runs.

**Why over alternatives:**
- *Discard `needsReview` entries between runs*: rejected — they'd be re-classified (and re-charged to OpenAI) every run, and there'd be no audit trail. Persisting them in the source file is cheap and keeps the review queue stable.
- *Always auto-write*: rejected. The 50% drop guard (Decision 5) exists precisely because listing pages can fail silently and we don't want to blow away the catalogue.

### Decision 5: Safety guard against catastrophic listing failure

The system refuses to write back if the discovered URL count for any food type drops by more than 50% relative to the existing count for that food type, unless `--force` is also passed. This protects against the failure mode where a listing page changes layout and silently returns 0 products.

### Decision 6: Product change detection via stable hash, stored per-source in `scraper/.cache/`

Each scrape run produces structured product output. We add a post-run step that, for each product, computes a SHA-256 hash over a normalised subset:

- normalised title
- normalised composition text
- normalised analytical constituents
- normalised ingredients description

Hashes persist at `scraper/.cache/<brand>.hashes.json` keyed by product URL. On subsequent runs the post-run step diffs old vs. new hashes and emits a `changed`, `unchanged`, `new`, `removed` summary. The cache is gitignored — it's run-local state, not committed dataset.

### Decision 7: One-shot manual migration, no dual-format support

The YAML→JSON conversion is performed once during implementation by an AI-assisted edit pass over the existing `scraper/sources/*.yaml` files. The implementer (a) converts each file to the new JSON shape (drops `productCounts`, adds an empty `discovery` block, adds an empty `needsReview` array), (b) sanity-checks each conversion by asserting `Object.values(json.products).flat().length === yaml.productCounts.total` before deleting the YAML, (c) removes `js-yaml` from `scraper/package.json` and `package-lock.json` once all YAMLs are gone. **No migration script is committed** — this is a one-time chore, not a recurring workflow.

**Why one shot, not dual-format:** supporting both formats in `loadSourceUrls` doubles the surface area, doubles the test matrix, and creates a "migrate later" tail that never finishes. The migration is mechanical and reversible from git history.

**Why no script:** there are ~40 sources, the conversion is straightforward (read YAML, transform, write JSON), and a script would be dead code the moment it ran successfully. An AI-assisted edit pass is the appropriate tool.

### Decision 8: New CLI surface, minimal disruption to existing commands

| Command | Behaviour |
|---|---|
| `npx ts-node src/discovery.ts --source <brand>` | Run discovery, print diff |
| `npx ts-node src/discovery.ts --source <brand> --write` | Run discovery, write back additions/removals/regroupings + persist `needsReview` |
| `npx ts-node src/scraper.ts <url> ...` | Unchanged |
| `npx ts-node src/scraper.ts --urls <file>` | Now requires `.json`; `.yaml` errors with a one-line migration hint |
| `npx ts-node src/batchScraper.ts --source <brand>` | Reads `<brand>.json`; gains `--detect-changes` (default `true`) |

## Risks / Trade-offs

- **[Risk] Manual migration mistakenly drops or duplicates URLs** → **Mitigation:** the implementer asserts the converted product total matches the prior YAML `productCounts.total` for every brand before deleting any YAML. The full migration lands in a single commit so it's trivially revertible.
- **[Risk] Listing pages change layout** → discovery silently returns 0 products and the diff suggests removing everything. **Mitigation:** the 50% guard (Decision 5).
- **[Risk] Pagination loops infinitely on misconfigured `nextSelector`** → **Mitigation:** hard cap at `maxPages` (default 20) and dedupe URLs across pages.
- **[Risk] OpenAI mis-categorises edge products** → **Mitigation:** confidence threshold + `needsReview` quarantine; AI never writes to `products` automatically.
- **[Risk] Robots.txt / rate-limiting on listing crawls** → **Mitigation:** descriptive `User-Agent`, sequential per-listing fetches, configurable delay (default 500ms) between page fetches.
- **[Risk] Cache file drift (deleted, corrupted)** → **Mitigation:** missing cache means "all current products are `new`" — non-fatal, just noisier on the next run.
- **[Risk] Existing tooling references `*.yaml` paths** → **Mitigation:** grep showed only `loadSourceUrls.ts` and one branch in `scraper.ts`; both are updated in this change. Any external scripts the user runs locally need a one-time path update.
- **[Trade-off] Discovery config in JSON is slightly less ergonomic to author than YAML** (no comments, mandatory quoting). Acceptable: each brand's `discovery` block is ~5–10 lines and only authored once. If commenting becomes important, the existing `<brand>.selectors.md` companion file already absorbs prose notes.
- **[Trade-off] No real-time / webhook detection** — stale data persists between manual runs. Acceptable; this change is about making periodic refresh safe and cheap, not real-time.
