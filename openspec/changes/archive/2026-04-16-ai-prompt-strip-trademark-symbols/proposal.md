## Why

Product names returned by the AI composition mapper can include trademark (™), copyright (©), and similar legal symbols embedded in source text. These symbols pollute product name fields in the exported data, causing inconsistent display and downstream processing issues.

## What Changes

- Add an explicit instruction to the OpenAI prompt requiring the AI to strip trademark (™), copyright (©), registered (®), and similar legal/special symbols from any product name or brand name fields in its output.

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `ai-product-composition-mapping`: Add a prompt-level requirement that product names and brand name values MUST NOT include trademark, copyright, registered, or similar legal symbols (e.g. ™, ©, ®).

## Impact

- The OpenAI prompt template in the scraper (`src/`) will be updated to include the symbol-stripping instruction.
- No schema changes — this is a prompt constraint only.
- No new environment variables or dependencies required.
- Hot-reload compatible — no EAS build needed.
