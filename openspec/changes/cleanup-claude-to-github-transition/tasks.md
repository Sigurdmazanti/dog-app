## 1. Fix `copilot-instructions.md`

- [x] 1.1 Replace the `# CLAUDE.md` title with `# Copilot Instructions`
- [x] 1.2 Replace the `This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.` description with a GitHub Copilot–appropriate attribution line

## 2. Fix `settings.local.json`

- [x] 2.1 Remove the `"Bash(claude doctor:*)"` entry from the `permissions.allow` array in `.github/settings.local.json`

## 3. Fix `react-native-expert.md`

- [x] 3.1 Replace the wrong project path `C:\Repos\dog-app\.claude\agent-memory\react-native-expert\` with `C:\Repos\dogapp\.github\agent-memory\react-native-expert\`
- [x] 3.2 Replace all references to `CLAUDE.md` with `copilot-instructions.md`
- [x] 3.3 Replace `Write and Edit tools` with `create_file and replace_string_in_file tools`

## 4. Migrate MCP server config

- [x] 4.1 Create `.vscode/mcp.json` at workspace root with `servers` key, converting `supabase` (HTTP) and `expo-docs` (stdio) from `app/.mcp.json`
- [x] 4.2 Delete `app/.mcp.json` (Claude Code format, superseded by `.vscode/mcp.json`)

## 5. Write `openspec/config.yaml`

- [x] 5.1 Populate the `context` block with tech stack, conventions, domain knowledge, and key constraints from `copilot-instructions.md`
- [x] 5.2 Add `rules` blocks for `proposal`, `specs`, and `tasks` tailored to a React Native / Expo / Tamagui mobile project

## 6. Verify

- [x] 6.1 Confirm no remaining occurrences of `claude doctor`, `claude.ai`, `# CLAUDE.md`, `dog-app`, `.claude\agent-memory`, or `Write and Edit tools` across all `.github/` files
- [x] 6.2 Confirm `.vscode/mcp.json` exists and uses the `servers` key
- [x] 6.3 Run `openspec instructions proposal --change <any>` and confirm `context` is populated in the output
