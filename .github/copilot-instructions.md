# Copilot Instructions

This file provides guidance to GitHub Copilot when working with code in this repository.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.1.0 | UI library |
| React Native | 0.81.4 | Mobile framework |
| Expo | 54.0.0 | Build toolchain |
| Expo Router | 6.0.3 | File-based routing |
| Tamagui | 1.126.13 | UI component system & styling |
| TypeScript | 5.9.2 | Type safety |
| React Hook Form | 7.56.4 | Form state management |
| Supabase | 2.57.4 | Backend-as-a-service (auth + database) |

## Commands

```bash
yarn start          # Start Expo dev server (clears cache)
yarn dev            # Start Expo dev server with dev client
yarn android        # Run on Android
yarn ios            # Run on iOS

yarn test           # Run tests in watch mode (jest-expo preset)
yarn test --testPathPattern="MyComponent"  # Run a single test file

yarn check:tamagui  # Validate Tamagui config
```

Package manager is **Yarn 4.9.1**. Always use `yarn`, not `npm`.

## Development Builds

The app runs via an **EAS development build** (not Expo Go). To run the app, the EAS dev client must already be installed on the device/emulator. Use `yarn dev` to start the dev server and connect to it from the installed dev client build.

> Note: This app lives in a monorepo. `react`, `react-dom`, and `react-native-web` deps were removed from the root and `metro.config.js` was adjusted accordingly.

## Architecture

### Routing
File-based routing via Expo Router inside `app/`. Tab navigation at `app/(tabs)/` is the initial route. Typed routes are enabled (`experiments.typedRoutes: true`). All new screens must follow the file-based convention — no programmatic route registration.

### Styling & UI
All UI is built with **Tamagui**. Do not use `StyleSheet.create` or inline styles. Design tokens are in `src/config/tokens/tokens.ts`, themes in `src/config/themes/themes.ts`. Reusable styled primitives live in `src/styled/` — extend these before creating new ones. Light and dark mode are both supported.

### Icons
Icons are standalone SVG components in `src/assets/icons/`. **No icon library is installed.** New icons must be created as SVG components — do not install or import from icon packages.

### Forms
All forms use **React Hook Form** with `FormProvider` + `useFormContext`. The add-dog form is multi-step; each step is a separate component under `src/components/forms/add-dog/steps/`. Form types are co-located with the form (e.g. `AddDog.types.ts` alongside `AddDogForm.tsx`).

### Providers
`src/Provider.tsx` is the root app wrapper — it composes GestureHandlerRootView, Redux Provider, AuthProvider, TamaguiProvider, and ToastProvider. Wire new root-level providers here, not in `app/_layout.tsx`.

### Supabase
Client is initialised once in `src/services/supabase/supabaseClient.ts`. Auth state is managed via React Context in `src/AuthProvider.tsx` — consume auth via this context, not direct Supabase calls in components. DB operations are in `src/services/`, split by domain (auth, dogs). Raw Supabase rows are mapped to typed models using mapper functions defined in `*.models.ts` files.

Required env vars: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY`.

### State Management
**Redux is pending removal.** Do not add new Redux slices or use `react-redux` / `@reduxjs/toolkit` in new code. Prefer React Context for shared state and React Hook Form for form state.

## Packages Pending Removal

Do not write new code that depends on these:
- `react-redux`
- `@reduxjs/toolkit`
- `expo-web-browser`
