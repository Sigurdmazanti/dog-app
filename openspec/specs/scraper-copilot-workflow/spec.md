# Spec: Scraper Copilot Workflow

## Purpose

Define the copilot instructions, package manager rules, scraper creation workflow, and script prohibitions for the `scraper/` project so Copilot behaves correctly when working on scrapers.

## Requirements

### Requirement: Scraper package manager instructions
The copilot instructions file SHALL include a clearly scoped section stating that the `scraper/` project uses **npm** as its package manager. The section MUST explicitly state that `yarn` SHALL NOT be used when working in `scraper/`.

#### Scenario: Working in scraper directory
- **WHEN** Copilot is working on files within `scraper/`
- **THEN** all package commands MUST use `npm` (e.g., `npm install`, `npm run dev`, `npx ts-node`)

#### Scenario: Existing app instructions unchanged
- **WHEN** Copilot is working on files within `app/`
- **THEN** the existing Yarn instructions MUST still apply

### Requirement: Scraper creation workflow documented
The copilot instructions SHALL include the exact step-by-step workflow for creating a new scraper, covering: source YAML file creation, scraper TypeScript file creation, and source registry entry.

#### Scenario: Creating a new scraper
- **WHEN** the user asks to create a scraper for a new brand
- **THEN** Copilot MUST follow the documented workflow: create `sources/<brand>.yaml`, create `src/scrapers/<brand>.ts`, register in `src/sourceRegistry.ts`

#### Scenario: Scraper file follows established pattern
- **WHEN** a new scraper file is created
- **THEN** it MUST use the `runScraper()` helper with `extractTitle`, `extractIngredientsDescription`, and `extractCompositionText` extractors, accepting `ScrapeRequest` and returning `Promise<ScrapeResult>`

### Requirement: No ad-hoc verification scripts
The copilot instructions SHALL explicitly prohibit Copilot from running ad-hoc verification or test scripts when creating or modifying scrapers. This includes temporary `.ts` files, `--eval` snippets, and throwaway scripts.

#### Scenario: After creating scraper files
- **WHEN** Copilot has finished creating scraper source files
- **THEN** it MUST NOT run any verification scripts, `--eval` commands, or create temporary files to test the scraper

#### Scenario: User requests testing
- **WHEN** the user explicitly asks to test a scraper against a URL
- **THEN** Copilot MUST use only the established command: `npx ts-node src/scraper.ts "<url>" --food-type <type> --no-sheets`

### Requirement: Scraper tech stack documented
The copilot instructions SHALL document the scraper's tech stack separately from the app's tech stack so Copilot has correct context.

#### Scenario: Scraper dependency context
- **WHEN** Copilot needs to understand the scraper project's dependencies
- **THEN** the instructions MUST list: TypeScript, ts-node, Cheerio, Axios, googleapis, OpenAI, and csv-writer as the key dependencies
