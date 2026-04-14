## Context

The scraper package (`scraper/`) is a standalone Node.js CLI tool with its own `tsconfig.json`. It currently uses `"moduleResolution": "node"`, which TypeScript 5+ treats as an alias for the deprecated `node10` strategy. This produces a compile-time error and will be removed in TypeScript 7.0.

The fix is to migrate to `"moduleResolution": "node16"`. This requires setting `"module": "node16"` as well, since TypeScript enforces that these two options are paired consistently. The scraper already uses CommonJS-style imports (`require`/`export =`), and `node16` supports CommonJS output when files use the `.ts` extension (not `.mts`).

## Goals / Non-Goals

**Goals:**
- Remove the TypeScript deprecation error on `scraper/tsconfig.json`
- Ensure the scraper compiles cleanly with `tsc --noEmit`
- Choose settings that are stable and won't require another migration before TypeScript 7.0

**Non-Goals:**
- Migrating the scraper to ESM (`.mts`/`.mjs`)
- Upgrading the TypeScript package version in `package.json`
- Modifying the root or app-level `tsconfig.json`

## Decisions

### Use `"moduleResolution": "node16"` over `"bundler"`

`node16` is the correct choice for a Node.js CLI (no bundler involved). `bundler` is intended for projects that use a bundler like Webpack or Vite and allows lax import rules that would mask real Node.js resolution errors.

**Alternatives considered:**
- `"moduleResolution": "nodenext"` — semantically equivalent to `node16` today; `node16` is more explicit about the target Node version.
- Adding `"ignoreDeprecations": "6.0"` — silences the warning without fixing it; defers the problem to TypeScript 7.0.

### Keep CommonJS output (`"module": "node16"` with `.ts` files)

`node16` module mode emits CommonJS for `.ts` files (the default). This preserves the current build output and avoids ESM migration complexity. Only `.mts`/`.cts` files force ESM/CJS selection explicitly.

### No `"target"` change

`"target": "ES2020"` is compatible with `node16` module mode. Changing it is out of scope.

## Risks / Trade-offs

- **Stricter import rules** → `node16` is more precise about import paths (e.g., requires explicit extensions for relative imports in some cases). Mitigation: run `tsc --noEmit` after the change and fix any new errors before merging.
- **Build output unchanged** → CommonJS output is preserved; no downstream script changes needed.

## Migration Plan

1. Update `scraper/tsconfig.json`: change `"module"` to `"node16"` and `"moduleResolution"` to `"node16"`
2. Run `tsc --noEmit` from the `scraper/` directory to confirm zero errors
3. Run a quick smoke test (`yarn start` or equivalent scraper command) to confirm runtime behaviour
