## 1. Log Helper (`scraper/src/helpers/logger.ts`)

- [x] 1.1 Create `logger.ts` with a `log(prefix: string, ...args: unknown[])` helper that prepends `new Date().toISOString()` and the prefix to each `console.log` call
- [x] 1.2 Add `logWarn` and `logError` variants that wrap `console.warn` / `console.error` with the same timestamp+prefix pattern
- [x] 1.3 Verify that calling `log('[1/5]', 'hello')` outputs a line beginning with an ISO timestamp followed by `[1/5] hello`

## 2. AI Mapper — Timeout & Outcome Logging (`scraper/src/helpers/aiProductCompositionMapper.ts`)

- [x] 2.1 Update `DEFAULT_TIMEOUT_MS` from `8_000` to `60_000`
- [x] 2.2 Wire `withTimeout(client.chat.completions.create(...), timeoutMs)` so the timeout is actually enforced on each API call
- [x] 2.3 Accept an optional `logPrefix: string` parameter on `mapProductCompositionWithAI` (and `requestAIMapping`) and thread it through to all internal log calls
- [x] 2.4 Replace all raw `console.log/warn` calls in the mapper with the `log`/`logWarn` helper, passing the prefix
- [x] 2.5 Log AI call success: emit `[ai-mapper] done in <duration>ms` after a successful response
- [x] 2.6 Log AI call failure: emit `[ai-mapper] error after <duration>ms — <message>` in the catch block
- [x] 2.7 Log AI call timeout: emit `[ai-mapper] timed out after <timeoutMs>ms` when `withTimeout` rejects
- [x] 2.8 Log retry attempts: emit `[ai-mapper] retry <n>/<maxRetries> after <delay>ms` before each retry wait
- [ ] 2.9 Verify with a dry run that timeout, error, and success lines appear in output

## 3. Run Scraper — Prefix Propagation (`scraper/src/helpers/runScraper.ts`)

- [x] 3.1 Accept an optional `logPrefix: string` parameter on `runScraper` / the exported scrape helper
- [x] 3.2 Replace raw `console.log/warn` calls with `log`/`logWarn`, passing the prefix
- [x] 3.3 Pass the prefix through to `mapProductCompositionWithAI`

## 4. Sheets Appender — Prefix Propagation (`scraper/src/helpers/googleSheetsAppender.ts`)

- [x] 4.1 Accept an optional `logPrefix: string` parameter on `appendRowToGoogleSheets`
- [x] 4.2 Replace raw `console.log/error` calls with `log`/`logError`, passing the prefix

## 5. Batch Scraper — Prefix Construction & Propagation (`scraper/src/batchScraper.ts`)

- [x] 5.1 Construct the prefix `[n/total]` per task inside the `pLimit` loop
- [x] 5.2 Pass the prefix to `scrapeUrl` (and from there to `runScraper` and `appendRowToGoogleSheets`)
- [x] 5.3 Replace raw `console.log/warn/error` calls in `batchScraper.ts` with the `log`/`logWarn`/`logError` helper

## 6. Main Scraper Entry Point (`scraper/src/scraper.ts`)

- [x] 6.1 Replace raw `console.log/warn/error` calls with the `log`/`logWarn`/`logError` helper (use empty prefix `""` for non-URL-specific lines)
- [x] 6.2 Pass the prefix through single-URL `scrapeUrl` calls (empty string)

## 7. Verification

- [ ] 7.1 Run `npm run dev -- --urls scrape-wet.md --food-type wet --no-sheets` and confirm every output line starts with an ISO timestamp
- [ ] 7.2 Confirm that AI mapper lines during a batch run show the `[n/total]` prefix
- [ ] 7.3 Confirm that AI success/error/timeout lines appear in the output (trigger an error by setting `OPENAI_TIMEOUT_MS=1` for a quick timeout test)
- [ ] 7.4 Run TypeScript compilation (`yarn tsc --noEmit -p scraper/tsconfig.json`) with no new errors
