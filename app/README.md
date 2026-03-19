## App Project

## Package Manager

- This folder uses Yarn.
- Use Yarn commands in this folder (`yarn install`, `yarn start`, `yarn dev`, `yarn test`).
- Do not use npm in `app/`.

Monorepo note:
- `app/` uses Yarn and has `yarn.lock`.
- `scraper/` uses npm and has `package-lock.json`.

## Monorepo note

Because this is in a monorepo, `react`, `react-dom`, and `react-native-web` dependencies were removed from the root and `metro.config.js` was adjusted.
