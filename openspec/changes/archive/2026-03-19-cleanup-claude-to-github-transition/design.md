## Context

The project previously used Claude Code (Anthropic) as its AI coding assistant, with tooling config stored in `.claude/`. It has since migrated to GitHub Copilot in VS Code, with config stored in `.github/`. The mechanical file move has already been done, but several files still carry Claude-specific language, a stale CLI permission, an incorrect project path, and references to Claude Code–specific tools/conventions that don't map to Copilot.

Files affected:
- `.github/copilot-instructions.md` — still titled `# CLAUDE.md` with a `Claude Code (claude.ai/code)` attribution
- `.github/settings.local.json` — contains `"Bash(claude doctor:*)"`, a Claude Code CLI permission entry that GitHub Copilot does not interpret
- `.github/agents/react-native-expert.md` — references `C:\Repos\dog-app\.claude\agent-memory\...` (wrong path, wrong directory), mentions `CLAUDE.md`, and refers to Claude Code's `Write and Edit tools`

## Goals / Non-Goals

**Goals:**
- Remove all Claude Code–specific references from `.github/` files
- Correct the wrong project path (`dog-app` → `dogapp`)
- Replace Claude Code tool names with Copilot-equivalent conventions
- Update memory directory references to align with the actual repo location
- Ensure `settings.local.json` contains only valid Copilot/VS Code permissions

**Non-Goals:**
- Changing the content, logic, or substance of the `react-native-expert` agent instructions
- Modifying the OpenSpec skills or commands — these are already tool-agnostic
- Setting up `.vscode/mcp.json` or other MCP plumbing (out of scope)
- Editing any application source code under `app/` or `src/`

## Decisions

**1. `copilot-instructions.md` title and attribution**
- Remove the `# CLAUDE.md` heading and replace with `# Copilot Instructions`
- Replace `"This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository."` with a neutral statement that refers to GitHub Copilot
- Rationale: The file is already named `copilot-instructions.md` — the body should match

**2. `settings.local.json` — remove stale permission**
- Remove `"Bash(claude doctor:*)"` from the `permissions.allow` array
- Leave `"mcp__supabase__list_tables"` and the `enabledMcpjsonServers` block unchanged — these are valid Copilot/MCP settings
- Rationale: The Claude CLI is not installed or used; keeping stale entries is misleading

**3. `react-native-expert.md` — memory path and tool references**
- Replace `C:\Repos\dog-app\.claude\agent-memory\react-native-expert\` with `C:\Repos\dogapp\.github\agent-memory\react-native-expert\`
- Replace `CLAUDE.md` references with `copilot-instructions.md`
- Replace `Write and Edit tools` (Claude Code tools) with `create_file and replace_string_in_file tools` (Copilot equivalents)
- Rationale: Incorrect paths cause silent failures; wrong tool names mislead the agent

## Risks / Trade-offs

- **Low risk overall** — purely textual changes to config/instruction files; no compiled code touched
- [Risk: `settings.local.json` format] → The `enabledMcpjsonServers` key is a Copilot/VS Code extension convention; we are not changing its format, only removing a stale entry — no breakage expected
- [Risk: agent memory path] → The updated path `C:\Repos\dogapp\.github\agent-memory\` does not yet exist as a directory; it will be created on first use by the agent — this is expected behavior and not a problem
