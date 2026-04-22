---
name: project-structure
description: >
  Trigger whenever the user asks where to put a new file, how to name something,
  wants to add a component, screen, hook, service, context, or any other code artifact,
  or asks "where should I create", "what files do I need", "scaffold", "add feature",
  "create a new", "new file for", "how should I structure". Use this skill proactively
  any time the work involves placing new code in the project tree — even if the user
  doesn't explicitly mention structure or naming.
---

# Project Structure Guide

Before answering, do a live scan of `src/` to reflect any recent additions:
```
ls -R src/
```
Use the result to confirm folder locations and spot any new patterns. Then apply the conventions below.

## Folder Map

```
src/
  components/    ← reusable UI pieces
  screens/       ← full-page navigation destinations
  hooks/         ← custom React hooks
  services/      ← API clients and business logic
  contexts/      ← React Context definitions and providers
  types/         ← TypeScript type definitions
  themes/        ← colour/token definitions
  navigation/    ← navigator configuration
```

See `references/project-tree.md` for the full annotated snapshot.

## Conventions by Artifact Type

### UI Component
- **Location:** `src/components/`
- **Folder:** `PascalCase/` — e.g. `FavoriteButton/`
- **Files:** `index.tsx` (component) + `styles.ts` (StyleSheet styles)
- **Export:** named — `export const FavoriteButton = ...`
- **Example paths:**
  ```
  src/components/FavoriteButton/index.tsx
  src/components/FavoriteButton/styles.ts
  ```

### Screen
- **Location:** `src/screens/`
- **Folder:** `PascalCaseScreen/` — always end with `Screen`
- **Files:** `index.tsx` + `styles.ts`
- **Export:** default — `export default function SettingsScreen() {...}`
- **Example paths:**
  ```
  src/screens/SettingsScreen/index.tsx
  src/screens/SettingsScreen/styles.ts
  ```

### Hook
- **Location:** `src/hooks/` (flat — no subfolder)
- **File:** `useCamelCase.ts` — always start with `use`
- **Export:** named — `export const useAnalytics = ...`
- **Example:** `src/hooks/useAnalytics.ts`

### Service
- **Location:** `src/services/`
- **File (simple):** `camelCaseService.ts` — always end with `Service`
- **Folder (feature with multiple files):** `featureName/` subfolder containing `camelCaseService.ts` and supporting files
- **Export:** named functions or a named service object
- **Examples:**
  ```
  src/services/analyticsService.ts          ← single-file service
  src/services/github/repositoriesService.ts  ← feature subfolder
  ```

### Context
- **Location:** `src/contexts/` (flat — no subfolder)
- **Files:** two files always, separated by concern:
  - `XxxContext.ts` — context definition and type (`createContext`, `useXxx` hook)
  - `XxxProvider.tsx` — provider component (JSX)
- **Example:**
  ```
  src/contexts/AnalyticsContext.ts
  src/contexts/AnalyticsProvider.tsx
  ```

### Type Definitions
- **Location:** `src/types/` (flat)
- **File:** `camelCase.ts`, named after the domain — e.g. `analytics.ts`
- **Export:** named types/interfaces

### Theme Variant
- **Location:** `src/themes/` (flat)
- **File:** `camelCase.ts` (e.g. `dark.ts`, `light.ts`)
- **Always** re-export from `src/themes/index.ts`

## Import Style

Always use the `@/` path alias — never relative `../` paths:
```ts
import { FavoriteButton } from '@/components/FavoriteButton';
import { useAnalytics } from '@/hooks/useAnalytics';
import { analyticsService } from '@/services/analyticsService';
```

## Naming Rules at a Glance

| Thing | Convention | Example |
|---|---|---|
| Component/Screen folder | PascalCase | `RepoCard/`, `LoginScreen/` |
| Hook file | `use` prefix, camelCase | `useDebounce.ts` |
| Service file | camelCase + `Service` suffix | `analyticsService.ts` |
| Context file | PascalCase + `Context` / `Provider` | `AuthContext.ts` |
| Type file | camelCase, domain-named | `repository.ts` |
| Constants | SCREAMING_SNAKE_CASE | `TOKEN_KEY` |
| Component export | named | `export const Chip` |
| Screen export | default | `export default function RepoListScreen` |

## How to Answer a "Where do I put X?" Question

1. Identify the artifact type (component, screen, hook, service, etc.)
2. State the parent folder
3. List the exact file paths to create
4. Show the correct export pattern
5. Show the import line using `@/`
6. Keep it short — structural guidance only, no implementation code
