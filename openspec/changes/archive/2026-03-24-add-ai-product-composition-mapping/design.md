## Context

The scraper currently relies on manually maintained extraction rules to map cleaned composition data into typed output fields. As field variants and label aliases grow, manual parsing logic becomes expensive to maintain and easy to regress. The requested change introduces an AI-assisted mapping stage that transforms cleaned scraped payloads into the existing canonical schema while preserving downstream contract stability for export and append flows.

Constraints:
- Existing schema contracts and row shape expectations must remain stable.
- Missing values must remain explicit and safe (null or existing fallback-safe behavior).
- AI output must be treated as untrusted and validated before use.
- The change lives in the scraper domain and does not affect mobile client rendering or native platform behavior.

Stakeholders:
- Scraper maintainers who currently update manual field extraction logic.
- Data consumers relying on stable Google Sheets column ordering and schema shape.

## Goals / Non-Goals

**Goals:**
- Add an AI-based mapping path that produces the current canonical product composition schema from cleaned scraped data.
- Enforce deterministic extraction rules through prompt contract and post-response validation.
- Preserve structural compatibility for existing scrape result and export pipelines.
- Provide safe fallback behavior when AI output is invalid, incomplete, or unavailable.

**Non-Goals:**
- Replacing the canonical schema with a new schema.
- Redesigning Google Sheets append format or column ordering.
- Introducing mobile app UI changes or native runtime behavior changes.
- Implementing autonomous guessing for missing values.

## Decisions

1. Add a dedicated AI mapper helper in the scraper domain
- Decision: Introduce a focused mapping module that takes cleanedData and returns schema-shaped JSON.
- Rationale: Isolates external model interaction from existing parser/export modules and makes failure handling explicit.
- Alternative considered: Embedding AI calls directly in existing scraper flow. Rejected because it couples transport, prompt, and fallback concerns into business logic.

2. Use strict prompt contract plus local schema validation
- Decision: Prompt requires JSON-only output, null for missing values, no guessing, and numeric normalization for percentage-like fields; local validator rejects non-conforming payloads.
- Rationale: LLM output is probabilistic and must be normalized into deterministic pipeline contracts.
- Alternative considered: Trusting raw model output. Rejected due to schema drift and runtime parsing risk.

3. Keep a fallback-safe output strategy
- Decision: On parse or validation failure, emit a structurally stable object aligned to current output expectations, with nulls/default-safe values rather than throwing pipeline-breaking errors.
- Rationale: Existing workflow expects stable shape for append/export.
- Alternative considered: Hard fail on AI parse errors. Rejected because it reduces pipeline resilience and increases manual reruns.

4. Make model selection and credentials configurable
- Decision: Use environment-based API key configuration and a cost-aware default model that can be changed without contract changes.
- Rationale: Supports operational flexibility and cost control while preserving behavior.
- Alternative considered: Hardcoded model and secret handling in code. Rejected for security and maintainability reasons.

## Risks / Trade-offs

- [Invalid or malformed model output] -> Mitigation: strict JSON parse, schema validation, and fallback-safe object generation.
- [Cost or latency increase from model calls] -> Mitigation: use low-cost model tier by default, add retry limits/timeouts, and log failures for tuning.
- [Silent field-quality regression] -> Mitigation: require explicit nulls for unknown fields, preserve deterministic post-processing, and capture mapping diagnostics.
- [External API unavailability] -> Mitigation: fail soft to fallback-safe mapping and keep export pipeline operational.

## Migration Plan

1. Introduce the AI mapper helper and validation contract behind the current mapping path.
2. Integrate mapper into scraper flow where cleaned data is currently converted into composition fields.
3. Gate rollout with environment configuration so non-configured environments continue using safe fallback behavior.
4. Verify output schema compatibility against existing append/export expectations.
5. Rollback strategy: disable AI mapping path via configuration and revert to existing manual mapping logic.

## Open Questions

- Should the fallback path fully preserve current manual extraction for all fields, or return null-only schema objects when AI fails?
- What operational thresholds (timeout, retry count) are acceptable for scraper batch jobs?
- Should mapping diagnostics be persisted for auditing prompt quality over time?