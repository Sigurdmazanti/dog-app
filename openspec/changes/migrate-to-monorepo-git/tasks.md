## 1. Pre-migration cleanup

- [ ] 1.1 Stage all 6 unstaged changes in `app/` (`git -C app add -A`)
- [ ] 1.2 Commit staged changes with a descriptive message (`git -C app commit -m "chore: commit pending changes before monorepo migration"`)
- [ ] 1.3 Verify `app/` working tree is clean (`git -C app status` shows nothing to commit)

## 2. Git root migration

- [ ] 2.1 Move `.git/` from `app/` to the workspace root (`Move-Item app\.git .git`)
- [ ] 2.2 Verify the move succeeded — `app/.git` must not exist; `.git/` must exist at root
- [ ] 2.3 Verify full history is intact (`git log --oneline` shows all previous commits from root)
- [ ] 2.4 Verify remote is preserved (`git remote -v` shows `origin` pointing to `https://github.com/Sigurdmazanti/dog-app.git`)

## 3. Root `.gitignore`

- [ ] 3.1 Create `c:\Repos\dogapp\.gitignore` covering: `scraper/node_modules/`, `scraper/dist/`, `.DS_Store`, `Thumbs.db`
- [ ] 3.2 Verify `scraper/node_modules/` (if present) no longer appears in `git status` after creation

## 4. Commit reorganization

- [ ] 4.1 Stage all untracked/modified files from root (`git add -A`)
- [ ] 4.2 Review staged files (`git status`) — confirm `openspec/`, `scraper/`, and root `.gitignore` are included; confirm no secrets or large binaries are staged
- [ ] 4.3 Commit the reorganization (`git commit -m "chore: migrate git root to monorepo structure"`)
- [ ] 4.4 Run `git log --oneline` and confirm the new commit appears on top of the full history

## 5. Verification

- [ ] 5.1 Confirm `git status` from root is clean
- [ ] 5.2 Confirm `openspec/` and `scraper/` are tracked (`git ls-files openspec scraper | head -10`)
- [ ] 5.3 Confirm `app/.gitignore` still exists and is committed
- [ ] 5.4 Push to remote when ready (`git push origin main`)
