---
name: react-native-architecture
description: >
  Trigger when working in this React Native project or a project with the same patterns:
  creating new screens, components, hooks, query files, or navigators; importing modules;
  or when the user asks about folder structure, navigation setup, or TypeScript paths.
  Err toward triggering — this skill prevents wrong import paths and wrong folder placement.
---

# React Native Project Architecture

## Folder Structure

All application code lives under `app/`:

```
app/
  components/       # Reusable UI components (one folder per component)
  screens/          # Screen-level components (one folder per screen)
  contexts/         # React Context providers + custom hooks
  queries/          # Apollo GraphQL queries/mutations + validated wrappers
  schemas/          # Zod validation schemas for API responses
  themes/           # Design tokens: Dimens, typography, Colors
  hooks/            # App-level custom hooks (keyboard, push notifications, etc.)
  utils/            # Pure utility functions
  objectTypes/      # TypeScript types organized by domain
  navigation/       # React Navigation setup
  icons/            # SVG icon components
  services/         # Business logic services
  constants/        # Application-wide constants
  i18n/             # i18next setup and translation files
  api/              # Third-party API clients (e.g. Sumsub)
```

Root-level files: `App.tsx` (provider setup), `index.tsx` (entry point).

## Path Aliases — Always Use These

Never use relative imports (`../../something`). Always use the configured path aliases:

| Alias | Resolves to |
|-------|-------------|
| `@components/*` | `app/components/*` |
| `@screens/*` | `app/screens/*` |
| `@contexts/*` | `app/contexts/*` |
| `@queries/*` | `app/queries/*` |
| `@schemas/*` | `app/schemas/*` |
| `@themes/*` | `app/themes/*` |
| `@hooks/*` | `app/hooks/*` |
| `@utils/*` | `app/utils/*` |
| `@objectTypes/*` | `app/objectTypes/*` |
| `@navigation/*` | `app/navigation/*` |
| `@icons/*` | `app/icons/*` |
| `@services/*` | `app/services/*` |
| `@constants/*` | `app/constants/*` |
| `@api/*` | `app/api/*` |
| `@assets/*` | `assets/*` |

```tsx
// Correct
import { DefaultButton } from '@components/DefaultButton';
import { useSession } from '@contexts/SessionContext';
import { Dimens } from '@themes/dimens';

// Wrong — never do this
import { DefaultButton } from '../../components/DefaultButton';
```

## Navigation — Nested Stacks

Use **nested stack navigators** for logical groupings. Each navigator has its own strongly-typed `ParamList`.

```
NavigationContainer
  └── Stack (StackParamList)          ← root navigator
        ├── Preload
        ├── Auth → AuthStack          ← nested stack
        │     ├── Intro
        │     ├── Login
        │     ├── SignUp
        │     └── ForgotPassword
        ├── BottomTab → BottomTabNavigator   ← nested tab navigator
        │     ├── Portfolio
        │     ├── Market
        │     └── Profile
        └── [modal / fullscreen screens]
```

**Type each navigator separately:**

```tsx
// navigation/index.tsx
export type AuthStackParamList = {
  Intro: Record<string, never>;
  Login: Record<string, never>;
  SignUp: Record<string, never>;
  ForgotPassword: Record<string, never>;
};

export type StackParamList = {
  Preload: Record<string, never>;
  Auth: { screen: keyof AuthStackParamList };
  BottomTab: Record<string, never>;
  Transaction: { type: TransactionType; fromAssetInfo?: FromToAssetInfo };
  // ...
};

const Stack = createNativeStackNavigator<StackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
```

**Create sub-navigators as separate components:**

```tsx
const AuthStackNavigator = () => (
  <AuthStack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Intro" component={IntroScreen} />
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Then mount it in the root Stack:
<Stack.Screen name="Auth" component={AuthStackNavigator} />
```

**Navigate to nested screens:**

```tsx
navigation.navigate('Auth', { screen: 'Login' });
```

## TypeScript

- `strict: true` is enabled — do not use `any` or `as unknown as T` shortcuts.
- `moduleResolution: "bundler"` — import from folder indexes, not explicit `.tsx` paths.
- Types go in `app/objectTypes/[domain]/` as `.type.ts` files.
- Schemas (Zod) go in `app/schemas/[name].schema.ts`.
