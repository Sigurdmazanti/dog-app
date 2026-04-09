## 1. `scraper/src/scraper.ts` — startup banner & single-URL mode

- [x] 1.1 Add a startup banner in `main()` that prints mode, food type, and (for batch modes) concurrency before any I/O
- [x] 1.2 Record a start timestamp at the top of `main()` for use by single-URL result timing
- [x] 1.3 In single-URL mode, print `✓ <title> (<elapsed>ms)` before the existing JSON dump
- [x] 1.4 Verify: run `yarn dev -- https://<valid-url> --food-type dry` and confirm banner + summary line appear

## 2. `scraper/src/batchScraper.ts` — URL count summary, per-task start log, elapsed time

- [x] 2.1 After the processable/skipped split, log the URL count summary (`X urls found, Y processable, Z skipped`) before the `pLimit` tasks are scheduled
- [x] 2.2 At the top of each `limit()` callback, record `const taskStart = Date.now()` and emit `[n/total] → <url>`
- [x] 2.3 Update the `✓` success line to include `(<elapsed>ms)` using `Date.now() - taskStart`
- [x] 2.4 Update the `✗` failure line to include `(<elapsed>ms)` using `Date.now() - taskStart`
- [x] 2.5 Verify: run `yarn dev -- --urls scrape-dry.md --food-type dry --no-sheets` and confirm banner, URL count, per-URL `→` lines, and elapsed times all appear

## 3. `scraper/src/helpers/runScraper.ts` — AI mapper invocation log

- [x] 3.1 Add a `console.log` line immediately before the `mapProductCompositionWithAI(compositionText)` call, logging `[ai-mapper] calling AI for <url>`
- [x] 3.2 Verify: run a single URL and confirm the `[ai-mapper]` line appears between the `→` start line and the result line
