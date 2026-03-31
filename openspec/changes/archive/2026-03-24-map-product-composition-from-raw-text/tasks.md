## 1. Mapper helper updates

- [x] 1.1 Update aiProductCompositionMapper contract to accept raw composition text input and keep canonical CompositionMappingResult output shape
- [x] 1.2 Refactor prompt construction and AI request flow to operate on raw text while preserving strict schema validation
- [x] 1.3 Ensure fallback behavior returns empty canonical sections with notes when AI is unavailable or fails validation
- [x] 1.4 Verification: run TypeScript check/build for scraper package to confirm helper changes compile cleanly

## 2. Scraper integration updates

- [x] 2.1 Update Acana EU scraper to pass raw .ingredients-list text into the mapper instead of row-based compositionEntries
- [x] 2.2 Remove or isolate legacy row extraction code paths that are no longer needed for Acana EU mapping
- [x] 2.3 Ensure fallback notes are logged consistently for AI-disabled and AI-failure cases
- [x] 2.4 Verification: run a scrape command against an Acana EU URL and confirm mapped sections are produced without runtime errors

## 3. Compatibility and rollout safeguards

- [x] 3.1 Confirm canonical section/key output remains compatible with exporter and Google Sheets appender expectations
- [x] 3.2 Update scraper README or inline helper docs to describe the new text-first mapper input contract and environment toggles
- [x] 3.3 Verify timeout/retry env behavior still works for text-based requests (OPENAI_TIMEOUT_MS and OPENAI_MAX_RETRIES)
- [x] 3.4 Verification: perform one end-to-end scrape plus append run and confirm no schema regression in downstream append pipeline
