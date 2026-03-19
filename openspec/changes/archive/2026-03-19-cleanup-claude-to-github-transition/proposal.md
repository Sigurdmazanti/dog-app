## Why

The project has migrated its AI tooling configuration from `.claude/` (Claude Code) to `.github/` (GitHub Copilot). Several files still contain Claude-specific references, an incorrect project path, and a Claude Code-specific permission that has no meaning in the Copilot context — these need to be cleaned up so the workspace is fully Copilot-native.

## What Changes

- `copilot-instructions.md`: Remove the `# CLAUDE.md` title and `Claude Code (claude.ai/code)` attribution; replace with GitHub Copilot-appropriate framing
- `settings.local.json`: Remove the `"Bash(claude doctor:*)"` permission entry which is a Claude Code CLI permission with no Copilot equivalent
- `react-native-expert.md`: Fix the wrong project path (`dog-app` → `dogapp`), replace `.claude/agent-memory/` references with the correct `.github/` memory conventions, update `CLAUDE.md` references to `copilot-instructions.md`, and replace Claude Code tool references (`Write and Edit tools`) with equivalent Copilot tooling
- `app/.mcp.json` → `.vscode/mcp.json`: Migrate MCP server config from the Claude Code format (`mcpServers` key, placed in the app subfolder) to the VS Code Copilot format (`servers` key at workspace root in `.vscode/mcp.json`)

## Capabilities

### New Capabilities

*(none — this is a cleanup change, no new capabilities)*

### Modified Capabilities

*(none — no spec-level requirement changes)*

## Impact

- `.github/copilot-instructions.md` — title and header description updated
- `.github/settings.local.json` — one stale permission entry removed
- `.github/agents/react-native-expert.md` — path, tool names, and file references corrected
- `.vscode/mcp.json` — created with VS Code Copilot MCP server format (supabase + expo-docs)
- `app/.mcp.json` — can be removed (superseded by `.vscode/mcp.json`)
- No runtime code changes; no dependencies affected
