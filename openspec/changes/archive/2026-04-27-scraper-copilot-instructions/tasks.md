## 1. Copilot Instructions Update

- [x] 1.1 Add `## Scraper Project` section to `.github/copilot-instructions.md` with scraper tech stack table (TypeScript, ts-node, Cheerio, Axios, googleapis, OpenAI, csv-writer)
- [x] 1.2 Add scraper commands subsection documenting: `npm run dev`, `npx ts-node src/scraper.ts`, and the `--food-type` / `--no-sheets` flags
- [x] 1.3 Add explicit package manager rule: "Package manager is **npm**. Always use `npm`/`npx` in `scraper/`, never `yarn`."
- [x] 1.4 Add scraper creation workflow subsection with the 3-step recipe: source YAML → scraper file → registry entry
- [x] 1.5 Add "Rules" subsection with prohibitions: no ad-hoc verification scripts, no `--eval` snippets, no temporary `.ts` files, no package installations
- [x] 1.6 Verify the updated file renders correctly and both app and scraper sections are clearly scoped

## 2. Repo Memory Update

- [x] 2.1 Update `/memories/repo/scraper-package-manager.md` to include the ad-hoc script prohibition and scraper creation workflow summary
