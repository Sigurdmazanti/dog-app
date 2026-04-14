## 1. Update tsconfig.json

- [x] 1.1 In `scraper/tsconfig.json`, change `"module": "commonjs"` to `"module": "node16"`
- [x] 1.2 In `scraper/tsconfig.json`, change `"moduleResolution": "node"` to `"moduleResolution": "node16"`
- [x] 1.3 Run `tsc --noEmit` from the `scraper/` directory and confirm zero errors or warnings

## 2. Smoke Test

- [x] 2.1 Run a scraper command (e.g., `yarn start` or equivalent) to confirm runtime behaviour is unchanged
