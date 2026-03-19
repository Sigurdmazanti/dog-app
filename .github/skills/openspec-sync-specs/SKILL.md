---
name: openspec-sync-specs
description: Sync delta specs from an active OpenSpec change into main specs before archiving. Use when archive flow or user requests spec synchronization.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.2.0"
---

Sync OpenSpec delta specs from a change into main specs.

**Input**: Optionally specify a change name. If omitted, infer from context or prompt the user to select from active changes.

**What this does**
- Applies delta spec sections from `openspec/changes/<name>/specs/*/spec.md`
- Updates corresponding main specs at `openspec/specs/<capability>/spec.md`
- Supports `ADDED`, `MODIFIED`, and `REMOVED` requirement operations
- Verifies results and reports a sync summary

---

## Steps

1. **Select the change**

   If name is provided, use it.
   Otherwise run:
   ```bash
   openspec list --json
   ```

   Selection rules:
   - If one active change exists, auto-select it
   - If multiple changes exist, use the **AskUserQuestion tool** to select
   - If no active changes exist, stop with a clear message

2. **Discover delta specs**

   Inspect:
   - `openspec/changes/<name>/specs/`

   If no delta specs exist, report: "No delta specs found; nothing to sync." and stop.

3. **For each capability delta file, load both files**

   For each:
   - Delta: `openspec/changes/<name>/specs/<capability>/spec.md`
   - Main: `openspec/specs/<capability>/spec.md` (create if missing)

   Parse requirement blocks by heading:
   - `### Requirement: <title>`
   - Requirement body extends until next requirement heading or end of section

4. **Apply delta operations**

   Process in this order:

   1. `## ADDED Requirements`
      - For each requirement title, append to main spec if title does not already exist
      - If title already exists, treat as conflict and ask user whether to skip or convert to modified

   2. `## MODIFIED Requirements`
      - Replace the requirement block in main spec with same title
      - If target requirement does not exist, ask user whether to add it as new

   3. `## REMOVED Requirements`
      - Remove matching requirement block from main spec
      - If target does not exist, record as "already absent"

   Notes:
   - Preserve scenario content exactly from delta block when adding/modifying
   - Keep markdown structure valid (blank lines between requirements)
   - Do not copy operation headers (`## ADDED Requirements`, etc.) into main specs

5. **Write updated main specs**

   Save each updated `openspec/specs/<capability>/spec.md` file.

6. **Validate and summarize**

   Run:
   ```bash
   openspec validate
   ```

   Then summarize:
   - Change name
   - Capabilities synced
   - Added/modified/removed counts
   - Conflicts and resolutions
   - Validation result

---

## Output On Success

```md
## Spec Sync Complete

**Change:** <name>
**Capabilities:** <capability-a>, <capability-b>

### Applied
- Added: <n>
- Modified: <n>
- Removed: <n>

### Validation
- openspec validate: ✓ passed
```

## Output If No Deltas

```md
## Spec Sync Skipped

**Change:** <name>
No delta specs found under `openspec/changes/<name>/specs/`.
```

## Guardrails

- Never archive in this skill; this skill only syncs specs
- Always read delta specs before editing main specs
- If a merge conflict is ambiguous, ask the user instead of guessing
- Keep requirement titles stable unless the user explicitly requests renames
- Preserve unrelated content in main specs
