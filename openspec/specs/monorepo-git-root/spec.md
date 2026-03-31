## Purpose

Define the monorepo git structure: a single repository root tracking all sub-projects with preserved history and remote configuration.

## Requirements

### Requirement: Single git root covers entire workspace
The workspace SHALL have exactly one `.git/` directory located at the repository root (`c:\Repos\dogapp\.git`), tracking all sub-projects: `app/`, `openspec/`, and `scraper/`.

#### Scenario: All top-level folders are tracked
- **WHEN** `git status` is run from `c:\Repos\dogapp`
- **THEN** changes in `app/`, `openspec/`, and `scraper/` are all reported

#### Scenario: No nested git repository remains
- **WHEN** the repository root is initialised
- **THEN** `app/.git` SHALL NOT exist

### Requirement: Full commit history is preserved
The existing commit history from the previous `app/.git` repository SHALL be preserved in full after migration.

#### Scenario: History is intact after migration
- **WHEN** `git log --oneline` is run from the new root
- **THEN** all commits that previously existed in `app/.git` MUST be present

### Requirement: Remote origin is preserved
The git remote `origin` pointing to `https://github.com/Sigurdmazanti/dog-app.git` SHALL carry over to the new root without reconfiguration.

#### Scenario: Remote is reachable after migration
- **WHEN** `git remote -v` is run from the new root
- **THEN** `origin` MUST list `https://github.com/Sigurdmazanti/dog-app.git` for both fetch and push

### Requirement: Root-level .gitignore covers workspace-wide patterns
A `.gitignore` file SHALL exist at the repository root covering patterns relevant to the wider workspace (scraper `node_modules`, OS artefacts). The existing `app/.gitignore` SHALL remain and continue to cover Expo/RN-specific patterns.

#### Scenario: Scraper node_modules is ignored
- **WHEN** `git status` is run after `yarn install` inside `scraper/`
- **THEN** `scraper/node_modules/` MUST NOT appear as an untracked file

#### Scenario: App gitignore is not removed
- **WHEN** the migration is complete
- **THEN** `app/.gitignore` MUST still exist and be committed
