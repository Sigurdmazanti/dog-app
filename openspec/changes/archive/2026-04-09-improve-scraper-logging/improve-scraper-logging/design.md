## Context

The scraper runs URLs concurrently using `pLimit`. During a batch run, multiple URLs are in-flight simultaneously, and every subsystem (scraper, AI mapper, sheets appender) emits its own `console.log`/`console.warn`/`console.error` calls independently. Because there is no timestamp and no shared context prefix, the terminal output is difficult to read: you cannot tell which AI mapper line belongs to which URL, and you cannot tell what order events happened in.

The timeout problem is separate but related: `aiProductCompositionMapper.ts` defines `DEFAULT_TIMEOUT_MS = 8_000` and a `withTimeout` helper, but neither is wired to the actual OpenAI `client.chat.completions.create()` call. When the AI call hangs or fails, nothing appears in the log.

## Goals / Non-Goals

**Goals:**
- Add ISO 8601 timestamps to every log line emitted by the scraper
- Propagate a `[n/total]` context prefix from batch task context through to AI mapper and sheets appender log lines
- Log AI call outcomes: success (with duration), failure (with error message and duration), and timeout (with duration)
- Enforce an actual timeout on the OpenAI API call
- Make the timeout value clearly visible and configurable via env var with a documented default

**Non-Goals:**
- Introducing a logging library (pino, winston, etc.) — raw `console.*` is sufficient for a CLI scraper
- Structured JSON log output
- Log levels, log rotation, or log file output
- Buffering or serializing log lines across concurrent tasks (interleaving is acceptable as long as each line is self-attributable)

## Decisions

### 1. Simple `log(prefix, ...args)` helper over a logger class

A small module-level helper function `log(prefix: string, ...args: unknown[])` that prepends an ISO timestamp and the given prefix before calling `console.log` is sufficient. A full logger class or singleton adds ceremony without benefit for a CLI tool with a single output stream.

**Alternatives considered:** AsyncLocalStorage to carry context implicitly through the call stack — rejected as over-engineering for a call stack that is already explicit and shallow.

### 2. Explicit prefix propagation through function arguments

`batchScraper` constructs the prefix `[n/total]` and passes it as a `logPrefix: string` argument to `scrapeUrl`. `scrapeUrl` passes it to `runScraper`, which passes it to `mapProductCompositionWithAI` and `appendRowToGoogleSheets`. Every log line within a URL's processing uses this prefix.

Single-URL mode passes an empty prefix (or omits it), preserving existing output shape.

**Alternatives considered:** A global mutable map keyed by URL — rejected because it creates shared state that complicates reasoning about concurrent writes.

### 3. Timestamp format: `new Date().toISOString()`

ISO 8601 UTC timestamps (e.g. `2026-04-09T14:23:01.123Z`) are sortable and unambiguous. No external date library needed.

### 4. AI timeout: 60 seconds, enforced via `Promise.race`

The existing `withTimeout` helper uses `Promise.race` — it just needs to be called. The default is raised from 8 s to **60 s** (`60_000 ms`) to accommodate large composition prompts. Operators can override via `OPENAI_TIMEOUT_MS`.

**Rationale for 60 s:** AI calls on large product composition text typically complete in 5–15 s; 60 s gives ample headroom for slow API responses while still catching genuine hangs before the retry loop wastes time.

### 5. AI call outcome logging

Three new log lines, all using the same `logPrefix`:
- On success: `[ai-mapper] done in <duration>ms`
- On failure: `[ai-mapper] error after <duration>ms — <message>`
- On timeout: `[ai-mapper] timed out after <timeoutMs>ms`

Retry attempts also log: `[ai-mapper] retry <n>/<maxRetries> after <delay>ms`.

## Risks / Trade-offs

- **Log volume increases** — every URL now emits more lines. For large batches (200+ URLs) this is noisier but still far more useful than silent failures.
   → Acceptable trade-off; no pagination or filtering is needed for CLI output.
- **Prefix string is passed through multiple function signatures** — adds a parameter to several helpers. The chain is short (≤4 hops) and the parameter is optional with a sensible default.
   → Manageable. Callers that do not need a prefix pass `""` or nothing.
- **60 s timeout may still mask very slow AI responses** — if the API takes 59 s a valid slow response will succeed, but operators may still find the wait puzzling.
   → Logged durations make slow-but-successful calls visible.
