## Context

The workspace at `c:\Repos\dogapp` contains three sub-projects: the React Native / Expo app (`app/`), the OpenSpec change management directory (`openspec/`), and a scraper utility (`scraper/`). Previously `app/` was the project root, so `.git/` lived inside it — leaving `openspec/` and `scraper/` untracked. The existing repo has 21 committed + 1 locally unpushed commit on `main`, 6 unstaged file changes, and a remote `origin` on GitHub.

## Goals / Non-Goals

**Goals:**
- Move `.git/` from `app/.git` to the workspace root with full history intact
- Bring `openspec/` and `scraper/` under version control in a single commit
- Create a root `.gitignore` for workspace-wide ignore rules
- Preserve the GitHub remote and all existing commits

**Non-Goals:**
- Rewriting history to retroactively prefix paths with `app/` (would break remote sync)
- Merging `app/package.json` with a root `package.json` (out of scope)
- Setting up CI/CD or GitHub Actions (separate concern)

## Decisions

### 1. Move `.git/` rather than `git init` + cherry-pick

**Decision:** Physically move `app/.git/` to `c:\Repos\dogapp\.git/` using `Move-Item`.

**Rationale:** A move preserves the entire object store, reflog, remote config, and branch pointers with zero data loss. `git init` + cherry-pick would rewrite SHAs, invalidating the GitHub remote history and requiring a `--force` push.

**Alternative considered:** `git filter-repo --to-subdirectory-filter app` — would rewrite all commit paths to include `app/` prefix, making `git log` on individual files more natural. Rejected because it rewrites history and breaks the remote without a force push, which is disruptive.

### 2. Keep `app/.gitignore`, add a root `.gitignore`

**Decision:** Leave `app/.gitignore` in place. Add a new, minimal `.gitignore` at the workspace root covering only workspace-wide patterns (scraper `node_modules`, OS files).

**Rationale:** `app/.gitignore` is managed by `expo-cli` (annotated header) and covers many RN-specific patterns. Duplicating or merging it into root creates maintenance overhead. Git applies `.gitignore` files hierarchically — root patterns + subdir patterns both apply automatically.

### 3. Commit unstaged changes before migration

**Decision:** Commit the 6 unstaged changes in `app/` _before_ moving `.git/`.

**Rationale:** After the move, git's working tree root shifts. Uncommitted changes tracked against the old root could cause confusing state. A clean HEAD before migration is safest.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| `git log -- app/src/foo.ts` works; `git log -- src/foo.ts` (old path) does not | Expected trade-off of not rewriting history. Document in repo README. |
| VS Code source-control panel needs to recognise the new root | VS Code detects `.git/` at workspace root automatically — no action needed since the workspace folder IS `c:\Repos\dogapp`. |
| EAS / Expo CLI relies on the git root for commit metadata | EAS walks up from the project directory (`app/`) to find `.git/` — it will find the new root correctly. |
| `.env` is currently unignored (tracked) | The existing `app/.gitignore` has `.env` listed; it's tracked by a prior explicit `git add`. No new exposure from this migration. |

## Migration Plan

1. Commit 6 unstaged changes inside `app/` (`git -C app add -A && git -C app commit`)
2. Move `app/.git` → root: `Move-Item app\.git .git`
3. Create `c:\Repos\dogapp\.gitignore`
4. From root: `git add -A && git commit -m "chore: migrate git root to monorepo structure"`
5. Verify: `git log --oneline`, `git remote -v`, `git status`
6. Push when ready: `git push origin main`

**Rollback:** Move `.git/` back to `app/.git` and delete the root `.gitignore`.
