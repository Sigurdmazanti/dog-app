## ADDED Requirements

### Requirement: Copilot instructions file has correct attribution
`copilot-instructions.md` SHALL use "Copilot Instructions" as its title and SHALL reference GitHub Copilot rather than Claude Code or claude.ai.

#### Scenario: File does not reference Claude Code
- **WHEN** the file is read
- **THEN** it SHALL NOT contain the text `# CLAUDE.md`
- **THEN** it SHALL NOT contain the text `claude.ai`

### Requirement: Settings file contains only valid Copilot permissions
`.github/settings.local.json` SHALL NOT contain any Claude Code CLI permission entries.

#### Scenario: No claude CLI permissions present
- **WHEN** the settings file is read
- **THEN** it SHALL NOT contain the text `claude doctor`

### Requirement: React Native Expert agent references correct project path
`react-native-expert.md` SHALL reference the correct project path `C:\Repos\dogapp` (not `C:\Repos\dog-app`).

#### Scenario: No hyphenated path in agent file
- **WHEN** the agent file is read
- **THEN** it SHALL NOT contain the path fragment `dog-app`

### Requirement: React Native Expert agent references correct instructions file
`react-native-expert.md` SHALL reference `copilot-instructions.md` wherever it previously referenced `CLAUDE.md`.

#### Scenario: No CLAUDE.md references in agent file
- **WHEN** the agent file is read
- **THEN** it SHALL NOT contain the text `CLAUDE.md`

### Requirement: React Native Expert agent references correct memory directory
`react-native-expert.md` SHALL reference the `.github/agent-memory/` directory instead of `.claude/agent-memory/`.

#### Scenario: No .claude memory path in agent file
- **WHEN** the agent file is read
- **THEN** it SHALL NOT contain the path fragment `.claude\agent-memory`
- **THEN** it SHALL contain `.github\agent-memory`

### Requirement: React Native Expert agent references correct Copilot tools
`react-native-expert.md` SHALL reference `create_file and replace_string_in_file tools` instead of the Claude Code `Write and Edit tools`.

#### Scenario: Claude Code tool names replaced
- **WHEN** the agent file is read
- **THEN** it SHALL NOT contain the text `Write and Edit tools`

### Requirement: MCP server config exists at workspace root in VS Code format
A `.vscode/mcp.json` file SHALL exist at the workspace root with a `servers` key containing the `supabase` and `expo-docs` server definitions.

#### Scenario: MCP config uses VS Code format
- **WHEN** `.vscode/mcp.json` is read
- **THEN** it SHALL contain a top-level `servers` key (not `mcpServers`)
- **THEN** it SHALL define a `supabase` server entry
- **THEN** it SHALL define an `expo-docs` server entry

### Requirement: Old Claude Code MCP config is removed
`app/.mcp.json` SHALL be deleted after migration to `.vscode/mcp.json`.

#### Scenario: Legacy MCP file no longer exists
- **WHEN** the workspace is inspected
- **THEN** `app/.mcp.json` SHALL NOT exist
