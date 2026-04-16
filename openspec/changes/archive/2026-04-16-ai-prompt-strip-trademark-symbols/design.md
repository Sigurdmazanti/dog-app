## Context

The AI composition mapper sends a prompt to OpenAI containing raw scraped product text. The returned JSON includes product name and brand name fields. Source pages frequently embed trademark (™), copyright (©), registered (®), and other legal/special symbols directly in product names. These symbols pass through into the mapper output and ultimately land in the exported Google Sheets data, causing inconsistent presentation.

The fix is a prompt-level constraint — no schema changes, no new dependencies.

## Goals / Non-Goals

**Goals:**
- Instruct the AI, via the prompt, to strip ™, ©, ®, and similar legal/special symbols from any product name or brand name it returns.
- Ensure the constraint is explicit and unambiguous so the model does not require inference.

**Non-Goals:**
- Post-processing or regex stripping in TypeScript code — the intent is to enforce clean output at the source (prompt), not patch it downstream.
- Stripping symbols from composition or nutritional text fields — only name/brand fields are in scope.
- Normalising other kinds of whitespace or encoding issues unrelated to legal symbols.

## Decisions

### Decision: Prompt instruction rather than post-processing

**Choice**: Add a natural-language rule directly in the OpenAI prompt.

**Rationale**: The AI already interprets the output schema from the prompt. Adding a formatting rule here is consistent with how other constraints (e.g. null for missing values, numeric percentages) are expressed. Post-processing in TypeScript would require maintaining a symbol list in code and would not prevent the model from producing garbled adjacent whitespace around stripped characters.

**Alternative considered**: Regex strip after JSON parse — rejected because it adds a fragile code path and doesn't address potential whitespace artifacts left behind after symbol removal.

### Decision: Target name and brand fields only

**Choice**: Scope the instruction to product name and brand name fields.

**Rationale**: Composition text may legitimately contain special characters (e.g. chemical formula notation). Broadening the rule risks unintended data loss.

## Risks / Trade-offs

- [Risk] Model may inconsistently apply the rule across retries → Mitigation: The instruction is explicit and imperative ("MUST NOT include"); consistent phrasing reduces ambiguity.
- [Risk] Adjacent whitespace left after stripping by the model (e.g. "Acana™ Wild" → "Acana  Wild") → Mitigation: The prompt instruction can also ask for trimmed, clean output with no extra spaces.
