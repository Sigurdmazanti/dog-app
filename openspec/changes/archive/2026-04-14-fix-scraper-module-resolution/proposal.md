## Why

TypeScript 5+ emits a deprecation warning for `"moduleResolution": "node"` (equivalent to `node10`), and it will stop functioning entirely in TypeScript 7.0. The scraper's `tsconfig.json` currently uses this deprecated value, which causes a compile-time error today and will become a hard break in a future TypeScript release.

## What Changes

- Replace `"moduleResolution": "node"` with `"moduleResolution": "node16"` in `scraper/tsconfig.json`
- Change `"module": "commonjs"` to `"module": "node16"` to match — `node16` resolution requires its paired module mode
- Update `"target"` from `"ES2020"` to `"ES2022"` to align with Node 16+ runtime capabilities (optional but recommended)

## Capabilities

### New Capabilities

<!-- none — this is a pure tooling config fix with no new domain capabilities -->

### Modified Capabilities

<!-- none — no spec-level behaviour changes -->

## Impact

- **`scraper/tsconfig.json`**: Updated compiler options
- **`scraper/package.json`**: No TypeScript version change needed — the deprecation warning is about the config value, not the TS version installed
- **Build output**: No change to emitted JavaScript — CommonJS output is preserved under `node16` module mode when files use `.ts` (not `.mts`/`.cts`) extensions
- Requires a test compile (`tsc --noEmit`) to confirm no new errors surface from stricter `node16` module resolution rules
