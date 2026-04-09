## Context

The scraper package uses a `sourceRegistry` pattern: each scraper is a function in `scraper/src/scrapers/`, and entries are registered with a domain string in `sourceRegistry.ts`. The `findSource` helper matches URLs via `url.includes(entry.domain)`.

Acana EU is already registered as `emea.acana`. The Acana US site (`www.acana.com`) uses the same HTML structure and Cheerio selectors. The only difference is the domain.

## Goals / Non-Goals

**Goals:**
- Add a dedicated scraper for `www.acana.com` product pages
- Register it in `sourceRegistry.ts` so URL-based dispatch works automatically

**Non-Goals:**
- Sharing / deduplicating selector logic with `acana-eu.ts` (YAGNI — two files are clearer than an abstraction used twice)
- Supporting any Acana subdomain other than `www.acana.com`

## Decisions

**Domain key: `www.acana.com` (not `acana.com`)**

Using `acana.com` would also match `emea.acana.com` because `findSource` uses `url.includes`. Using `www.acana.com` is specific enough to match only the US storefront and never the EU subdomain. The EU entry (`emea.acana`) is equally specific, so both entries coexist safely.

**Copy selectors verbatim, no shared helper**

The selector set is small (3 functions). Extracting a shared helper would add indirection for no real benefit. If a third Acana region were added in future, that would be the time to consider a factory or shared config.

## Risks / Trade-offs

- [Risk] Acana US restructures its HTML → Mitigation: same risk exists for EU scraper; no special mitigation needed beyond monitoring scrape output
- [Risk] `www.acana.com` URLs without the `www.` prefix slip through → Mitigation: verify that product URLs in scrape lists include `www.`; the domain key can be widened later if needed
