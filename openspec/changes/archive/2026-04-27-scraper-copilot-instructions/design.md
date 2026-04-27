## Context

This is a monorepo with two distinct projects:

1. **`app/`** — React Native / Expo mobile app, managed by **Yarn 4.9.1**
2. **`scraper/`** — Node.js CLI scraper for dog food product data, managed by **npm** (`package-lock.json`)

The repository's `.github/copilot-instructions.md` currently only documents the app project. It explicitly states "Always use `yarn`, not `npm`" — which is correct for `app/` but wrong for `scraper/`. There are no scraper-specific instructions anywhere.

This causes two persistent problems:
- Copilot runs `yarn` commands in `scraper/`, which fail because there's no `yarn.lock`
- Copilot generates ad-hoc verification scripts (e.g., `tmp-verify.ts`, inline `--eval` scripts) that fail due to module resolution and then require manual approval for each attempt

## Goals / Non-Goals

**Goals:**
- Add a scraper-specific section to copilot-instructions.md that documents the correct package manager, file conventions, and creation workflow
- Explicitly prohibit running ad-hoc verification/test scripts when creating scrapers
- Reinforce these rules in repo memory for additional context

**Non-Goals:**
- Restructuring the scraper project itself
- Changing how the app project's instructions work
- Creating a separate `.github/copilot-instructions.md` for the scraper (VS Code scopes instructions per repo, not per folder)
- Adding automated tests or CI for scrapers

## Decisions

### 1. Single instructions file with project-specific sections

**Decision**: Add a `## Scraper Project` section to the existing `.github/copilot-instructions.md` rather than creating a separate file.

**Rationale**: VS Code's Copilot reads `.github/copilot-instructions.md` per workspace root. Since both projects share the same repo root, a single file with clearly separated sections is the correct approach. A separate file would be ignored.

**Alternative considered**: Folder-scoped `.instructions.md` files — these exist but are less reliable and not consistently loaded in all Copilot surfaces.

### 2. Explicit "DO NOT" rules for scraper workflow

**Decision**: Include concrete prohibitions:
- DO NOT use `yarn` in `scraper/`
- DO NOT run ad-hoc verification scripts, `--eval` snippets, or create temporary `.ts` files to test scrapers
- DO NOT install packages — the scraper's dependencies are stable

**Rationale**: Positive-only instructions ("use npm") haven't been sufficient — the yarn instruction in the app section overrides. Explicit prohibitions at the scraper level are needed to counteract.

### 3. Document the exact scraper creation recipe

**Decision**: Include a step-by-step recipe for creating a new scraper with the exact files, patterns, and registration steps.

**Rationale**: When Copilot knows exactly what files to create and what they should contain, it doesn't need to run verification scripts. The scripts were a symptom of uncertainty.

## Risks / Trade-offs

- **[Instructions grow long]** → The file stays under 150 lines. If it grows further in the future, consider splitting via VS Code's `applyTo` folder-scoped instructions.
- **[Rules may be ignored by Copilot]** → Reinforce via repo memory as a secondary signal. The combination of instructions + memory has proven more reliable than either alone.
- **[App instructions context leaks into scraper work]** → Mitigated by the explicit "when working in `scraper/`" scoping in the new section.
