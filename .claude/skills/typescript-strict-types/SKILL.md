---
name: typescript-strict-types
description: Enforces strict TypeScript typing patterns in all code. Applies to any task involving writing, editing, or reviewing TypeScript or React Native code. Covers type safety, generics, utility types, discriminated unions, and interface design.
---

# TypeScript Strict Types

## Core Rules

1. **Never use `any`** -- use `unknown` with type narrowing, or define a proper type/generic
2. **Prefer `interface`** for object shapes; use `type` for unions, intersections, and mapped/utility types
3. **Explicit return types** on all exported functions, hooks, and components
4. **`readonly`** on props, state shapes, and data that should not mutate
5. **`as const`** for literal tuples, object enums, and config objects
6. **No type assertions (`as`)** unless narrowing from `unknown` after a runtime check

## Patterns

### Discriminated Unions over Optional Fields

```typescript
// Correct
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };

// Incorrect -- ambiguous which fields exist
type RequestState = {
  status: string;
  data?: User;
  error?: Error;
};
```

### Utility Types over Manual Retyping

```typescript
// Correct
type UserPreview = Pick<User, 'id' | 'name' | 'avatarUrl'>;
type PartialSettings = Partial<Settings>;
type UserMap = Record<string, User>;

// Incorrect
type UserPreview = { id: string; name: string; avatarUrl: string };
```

### Generic Constraints

```typescript
// Correct -- constrained generic
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Incorrect -- unconstrained
function getProperty(obj: any, key: string): any {
  return obj[key];
}
```

### React Native Props

```typescript
import { ViewProps, TextProps } from 'react-native';

interface CardProps extends ViewProps {
  /** Card title displayed at the top */
  readonly title: string;
  /** Optional subtitle below the title */
  readonly subtitle?: string;
  readonly onPress: () => void;
}
```

### Readonly Data

```typescript
// Props and config should be readonly
interface AppConfig {
  readonly apiUrl: string;
  readonly features: readonly string[];
}

const ROUTES = ['home', 'profile', 'settings'] as const;
type Route = (typeof ROUTES)[number]; // 'home' | 'profile' | 'settings'
```

### Type Narrowing (instead of `as`)

```typescript
// Correct -- runtime check then narrow
function processValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  throw new Error(`Expected string, got ${typeof value}`);
}

// Incorrect -- unsafe assertion
function processValue(value: unknown): string {
  return (value as string).toUpperCase();
}
```

## Hook Return Types

```typescript
interface UseAuthReturn {
  readonly user: User | null;
  readonly isLoading: boolean;
  readonly signIn: (credentials: Credentials) => Promise<void>;
  readonly signOut: () => Promise<void>;
}

function useAuth(): UseAuthReturn {
  // ...
}
```

## tsconfig.json Baseline

Ensure these flags are enabled in every project:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Quick Reference

| Pattern | Do | Don't |
|---|---|---|
| Unknown data | `unknown` + narrowing | `any` |
| Object shapes | `interface` | `type` (for simple objects) |
| Unions/intersections | `type` | `interface` |
| Immutable data | `readonly` / `as const` | Mutable by default |
| Assertions | Runtime check + narrow | `as Type` |
| Exports | Explicit return type | Inferred return type |
| Props | Extend RN base props | Standalone interface |
| Enums | `as const` object/array | `enum` keyword |
