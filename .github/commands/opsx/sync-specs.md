---
name: "OPSX: Sync Specs"
description: Sync delta specs from an active change into main specs
category: Workflow
tags: [workflow, specs, sync]
---

Sync OpenSpec delta specs from a change into main specs.

**Input**: Optionally specify a change name after `/opsx:sync-specs` (e.g., `/opsx:sync-specs add-auth`). If omitted, infer from context or prompt for selection.

**Steps**

1. Invoke the `openspec-sync-specs` skill.
2. Pass through the selected or provided change name.
3. Return the skill summary (capabilities synced, operation counts, validation status).

**Output On Success**

```md
## Spec Sync Complete

**Change:** <name>
**Capabilities:** <capabilities>
- Added: <n>
- Modified: <n>
- Removed: <n>
- Validation: ✓ passed
```

**Guardrails**
- Do not archive in this command.
- If no delta specs are present, report and exit cleanly.
