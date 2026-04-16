## 1. Prompt Update

- [x] 1.1 Locate the OpenAI prompt construction in the AI composition mapper source file
- [x] 1.2 Add an explicit instruction to the prompt stating that product name and brand name fields MUST NOT contain trademark (™), copyright (©), registered (®), or similar legal/special symbols
- [x] 1.3 Add an instruction that name values must be trimmed with no extra surrounding whitespace
- [x] 1.4 Verify the updated prompt text reads clearly and is unambiguous

## 2. Verification

- [x] 2.1 Run a manual scrape against a source known to have trademark symbols in product names and confirm the mapper output is clean
- [x] 2.2 Confirm that products without symbols are returned unchanged
