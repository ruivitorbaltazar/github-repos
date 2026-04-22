---
name: react-native-data-layer
description: >
  Trigger when writing or modifying API calls, queries, mutations, data-fetching hooks,
  authentication logic, or Zod schemas. Also trigger when the user asks about how to
  fetch data, handle errors, manage auth tokens, or add a new endpoint. Covers both
  Apollo Client (GraphQL) and react-query (REST/GraphQL) patterns with Zod validation.
  Err toward triggering for any data layer work.
---

# React Native Data Layer Patterns

## Step 1 — Identify the data fetching library

Check `package.json` to pick the right reference. Only load the reference file for the library the project actually uses — do not load both.

- **`@apollo/client`** → read `references/apollo.md`
  Covers: validated wrappers (`useValidatedQuery`/`useValidatedLazyQuery`/`useValidatedMutation`), `TypedDocumentNode` wiring, GraphQL codegen (`@glocal/types/generated`), `ValidatedSchema` drift checks, Zod schemas in `@glocal/types`, Apollo authLink/errorLink behavior, query file conventions.

- **`@tanstack/react-query`** → read `references/react-query.md`
  Covers: `useQuery`/`useMutation` hooks, Zod `parse` at the fetch boundary, API client interceptor-based auth.

- **Both installed** → ask the user which to use for the new endpoint before proceeding.

## Step 2 — Shared rules (both libraries)

### Global state — React Context

Use `SessionContext` for auth state, `SnackbarContext` for errors. Never duplicate these into local component state.

```tsx
import { useSession } from '@contexts/SessionContext';
import { useSnackbar } from '@contexts/SnackbarContext';

const { saveNewSession, clearSession, navigateToHome } = useSession();
const { showSnackbar } = useSnackbar();

showSnackbar(t('error.general'), 'error');
```

### Error handling flow

1. Query/mutation returns `{ error }` → check `response.error`.
2. Map to user-facing message using `t()` + error code.
3. Display via `showSnackbar(message, 'error')`.
4. For auth failures: call `clearSession()` to log out.

```tsx
const response = await signIn(email, password);
if (response.error) {
  clearSession(false, true);
  showSnackbar(t('error.general'), 'error');
  setLoading(false);
  return;
}
```

### Token storage

Tokens live in native secure storage via `expo-secure-store` through `localStorageUtils`:

```tsx
import { localStorageUtils } from '@utils/localStorageUtils';

const session = await localStorageUtils.getSession();
await localStorageUtils.setSession(newSession);
await localStorageUtils.removeSession();
```

Library-specific token injection and 401-retry details live in the per-library reference.
