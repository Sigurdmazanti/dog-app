## Context

The `scraper/sources/bosch.yaml` file was created as part of the `bosch-scraper` change with empty product lists (`dry`, `wet`, `treats`, `misc`). The Bosch scraper implementation is complete and registered, but cannot produce any output until the YAML is populated with URLs. All provided URLs are from the Bosch English-language storefront (`bosch-tiernahrung.de/bosch_de_en/`).

## Goals / Non-Goals

**Goals:**
- Populate all four product URL lists (`dry`, `wet`, `treats`, `misc`) in `bosch.yaml`
- Set accurate `productCounts` values for each category and `total`

**Non-Goals:**
- Changes to scraper code, selector references, or any other source files
- Validation or deduplication beyond what is provided by the user

## Decisions

**Data-only YAML edit** — No code changes are needed. The YAML structure already supports lists per category. URLs are appended directly to each list.

**Count calculation** — `productCounts` values are derived by counting the URLs provided per section. `total` is the sum of all four category counts.

## Risks / Trade-offs

- [Risk: URL validity] Some URLs may 404 or redirect → Mitigation: scraper already handles errors per-URL; invalid URLs will be skipped at runtime
- [Risk: duplicate URLs across categories] Minimal risk given the user-supplied split; no deduplication logic required

