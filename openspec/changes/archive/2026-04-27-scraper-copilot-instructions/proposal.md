## Why

Copilot repeatedly makes two critical mistakes when working on the scraper project:

1. **Uses `yarn` instead of `npm`** — The root copilot-instructions.md says "Always use `yarn`, not `npm`", but the scraper project (`scraper/`) uses npm with `package-lock.json`. Every scraper session starts with failed yarn commands.
2. **Runs broken verification scripts** — When creating new scrapers, Copilot generates and executes ad-hoc TypeScript scripts to verify the scraper works. These scripts regularly fail due to module resolution issues, import path problems, or Node.js configuration quirks — requiring manual approval each time and providing no value.

The root cause is that the repository has **zero copilot instructions for the scraper project**. The only instructions cover the React Native app, and they actively mislead when working in `scraper/`.

## What Changes

- **Add scraper-specific section to `.github/copilot-instructions.md`** covering:
  - The scraper project uses **npm** (not yarn) — `package-lock.json`, `npm run dev`, `npx ts-node`
  - The correct scraper creation workflow (source YAML → scraper file → registry entry)
  - The file patterns and conventions (CSS selector extractors, `runScraper()` helper, `ScrapeRequest`/`ScrapeResult` types)
  - **Explicit ban on running ad-hoc verification scripts** — write the code, don't test it with throwaway scripts. The user will test manually.
- **Update repo memory** to reinforce the npm-not-yarn rule so it's picked up even outside instruction context

## Capabilities

### New Capabilities
- `scraper-copilot-workflow`: Copilot instructions covering the scraper project's package manager, file conventions, creation workflow, and rules against running unnecessary scripts

### Modified Capabilities
<!-- No existing spec-level requirements are changing -->

## Impact

- **Affected code**: `.github/copilot-instructions.md` — adding a new section
- **Affected workflow**: All future scraper creation and modification sessions
- **No runtime impact** — this is purely developer tooling configuration
- **No new dependencies**
