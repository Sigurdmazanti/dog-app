## Why

The AI composition mapper in the scraper times out consistently at its current 60-second default. When scraping sources like Canex with many products, every single AI mapping call exceeds 60s, exhausts retries, and falls back to empty composition data — making the scrape results incomplete. Increasing the default timeout to 120 seconds gives the model enough time to respond under normal load.

## What Changes

- Increase `DEFAULT_TIMEOUT_MS` from `60_000` (60s) to `120_000` (120s) in the AI product composition mapper.
- No new features, no API changes, no breaking changes. The `OPENAI_TIMEOUT_MS` env var override continues to work as before.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

_(none — this is a configuration constant change, not a spec-level behavior change)_

## Impact

- **Code**: Single constant in `scraper/src/helpers/composition/aiProductCompositionMapper.ts`
- **Behaviour**: Batch scraping jobs will wait longer per AI call before timing out, reducing false failures. Total batch runtime may increase when the API is genuinely unreachable (timeout × retries per URL).
- **Dependencies**: None
- **Cross-platform**: N/A (scraper is a Node.js CLI tool)
- **EAS build**: Not required — scraper is independent of the React Native app
