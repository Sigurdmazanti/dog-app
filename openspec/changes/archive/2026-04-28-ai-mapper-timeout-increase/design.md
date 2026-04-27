## Context

The scraper's AI composition mapper (`scraper/src/helpers/composition/aiProductCompositionMapper.ts`) calls the OpenAI API to map raw product text into structured composition data. It uses a `withTimeout` wrapper that races the API promise against a `setTimeout`. The current default is 60 seconds (`DEFAULT_TIMEOUT_MS = 60_000`), configurable via `OPENAI_TIMEOUT_MS` env var.

In practice, 60s is insufficient — batch scrapes (e.g. Canex with 44 products) see every AI call time out, exhaust retries, and fall back to empty data.

## Goals / Non-Goals

**Goals:**
- Increase the default timeout to 120 seconds so AI mapping succeeds under normal API latency without requiring env var overrides.

**Non-Goals:**
- Refactoring the timeout mechanism (e.g. using `AbortController` or the OpenAI SDK's built-in `timeout` option).
- Changing retry count or backoff strategy.
- Changing concurrency defaults.

## Decisions

**1. Change `DEFAULT_TIMEOUT_MS` from `60_000` to `120_000`**

Rationale: The simplest fix — one constant change. The env var override (`OPENAI_TIMEOUT_MS`) still works for users who want a different value. 120s is generous enough for large prompts while still failing reasonably fast when the API is truly unreachable.

Alternative considered: Using the OpenAI SDK's `timeout` constructor option instead of `withTimeout`. This would be cleaner but is a larger refactor and out of scope.

## Risks / Trade-offs

- **[Longer failure detection]** → When the API is genuinely unreachable, each URL now takes up to 120s × 3 attempts = 6 minutes before giving up (vs 3 minutes before). Mitigation: acceptable for a CLI tool; users can set `OPENAI_TIMEOUT_MS=60000` to restore old behaviour.
- **[No risk to existing overrides]** → Anyone already setting `OPENAI_TIMEOUT_MS` in `.env` is unaffected since the env var takes precedence over the default.
