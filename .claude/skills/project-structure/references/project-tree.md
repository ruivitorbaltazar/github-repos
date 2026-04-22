# Project Tree Snapshot

> Last updated: 2026-04-22. Re-scan with `ls -R src/` when in doubt.

```
src/
  components/
    Banner/
      index.tsx      ← informational banner component (named export)
      styles.ts
    Chip/
      index.tsx      ← selectable filter chip (named export)
      styles.ts
    RepoCard/
      index.tsx      ← repository card (named export)
      styles.ts
    RepoCardSkeleton/
      index.tsx      ← loading placeholder (named export)
      styles.ts

  screens/
    LoginScreen/
      index.tsx      ← login page (default export)
      styles.ts
    RepoDetailsScreen/
      index.tsx      ← repo detail page (default export)
      styles.ts
    RepoListScreen/
      index.tsx      ← repo list + search + filter (default export)
      styles.ts

  hooks/
    useAuth.ts         ← reads AuthContext
    useDebounce.ts     ← debounces a value
    useLanguages.ts    ← fetches language list from GitHub
    useRepositories.ts ← fetches/searches repositories (React Query)
    useTheme.ts        ← reads ThemeContext

  services/
    auth0.ts           ← Auth0 authentication service
    github/
      auth.ts          ← GitHub token validation
      client.ts        ← Axios client setup
      languages.ts     ← language metadata API calls
      repositories.ts  ← repo search/fetch API calls

  contexts/
    AuthContext.ts     ← context definition + useAuth hook
    AuthProvider.tsx   ← provider component
    ThemeContext.tsx   ← context definition + useTheme hook
    ThemeProvider.tsx  ← provider component

  types/
    navigation.ts      ← RootStackParamList
    repository.ts      ← Repository, RepoCardProps types
    theme.ts           ← Theme, ThemeMode types

  themes/
    dark.ts            ← dark colour tokens
    index.ts           ← re-exports all themes
    light.ts           ← light colour tokens

  navigation/
    index.tsx          ← root navigator (Stack)
```
