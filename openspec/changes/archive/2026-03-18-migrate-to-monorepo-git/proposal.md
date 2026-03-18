## Why

The git repository is currently rooted inside the `app/` subfolder, leaving `openspec/` and `scraper/` outside version control entirely. Moving the git root to the workspace root brings the full project under one coherent history and enables consistent tooling (CI, branch protection, code review) across all sub-projects.

## What Changes

- `.git/` directory moved from `app/.git` to the repo root `c:\Repos\dogapp\.git`
- A root-level `.gitignore` created to cover workspace-wide ignore rules (`scraper/node_modules`, OS files, etc.)
- All previously untracked folders (`openspec/`, `scraper/`) are committed into the repo
- Existing `app/.gitignore` remains in place and continues to cover the Expo/RN project
- Remote `origin` pointing to `https://github.com/Sigurdmazanti/dog-app.git` is preserved as-is

## Capabilities

### New Capabilities

- `monorepo-git-root`: Version-control the entire workspace (app, openspec, scraper) from a single git root with a shared history

### Modified Capabilities

<!-- No existing specs exist; no requirement-level changes to existing capabilities -->

## Impact

- **No app code changes** — zero changes to React Native, Expo, Tamagui, or Supabase files
- **`.git/` relocation** — all git tooling (VS Code source control, GitHub Actions, EAS) must reference the new root; branch and remote config carry over automatically
- **`scraper/`** — will be added to version control for the first time; its `node_modules/` must be gitignored at root level
- **`openspec/`** — will be added to version control for the first time
- **Hot-reload only** — no EAS build required; this is a repo-structure change only
