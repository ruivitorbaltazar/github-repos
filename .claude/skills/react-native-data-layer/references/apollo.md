# Apollo Client (GraphQL) Patterns

Load this reference when the project uses `@apollo/client`.

## Never use raw Apollo hooks

Always use the validated wrappers in `@glocal/core` — they run Zod validation on the response and return a consistent `{ data, error }` shape.

```
packages/core/src/queries/useValidatedQuery.ts      → useValidatedQuery
packages/core/src/queries/useValidatedLazyQuery.ts  → useValidatedLazyQuery
packages/core/src/queries/useValidatedMutation.ts   → useValidatedMutation
```

## Type-safe query binding

Every query hook wires three pieces together:

1. **`graphql()` tag** from `@graphql` (re-export of `@glocal/core`'s generated client preset). Returns a `TypedDocumentNode` with operation + variables types fully inferred from the schema — no manual type imports.
2. **Zod schema** from `@glocal/types` — runtime validation + inferred TS type.
3. **`ValidatedSchema<Schema, GeneratedOperation>` util** from `@glocal/types` — compile-time assertion that the Zod schema's shape matches the codegen operation type. Use `ResultOf<typeof DOC>` to extract the generated type. Emits a readable `__schema_drift__` error if they diverge.

## Codegen ownership

- Codegen lives in `@glocal/core` (config: `packages/core/codegen.ts`, client preset).
- Schema source: `packages/core/src/generated/schema.graphql` (emitted by backend).
- Codegen scans `packages/core/src/queries/**/*.ts` for `graphql(...)` docs.
- Output: `packages/core/src/generated/` — `gql.ts`, `graphql.ts`, `fragment-masking.ts`, `index.ts`.
- `@glocal/types` no longer owns codegen; no `@glocal/types/generated` subpath exists.

## Path aliases (core tsconfig + mobile metro + jest)

- `@graphql` → `packages/core/src/graphql.ts` (re-exports `graphql` tag, `ResultOf`, `VariablesOf`, and everything from `./generated/graphql`).
- `@generated/*` → `packages/core/src/generated/*`.

## Adding a new query

```tsx
// packages/core/src/queries/[domain]/useGetMyThing.ts
import { useQuery } from '@apollo/client/react';
import { MyThingResponseSchema } from '@glocal/types';
import type { ValidatedSchema } from '@glocal/types';

import { graphql, type ResultOf } from '@graphql';
import { useValidatedQuery } from '@queries/useValidatedQuery';
import { useValidatedLazyQuery } from '@queries/useValidatedLazyQuery';

const GET_MY_THING = graphql(`
  query GetMyThing($id: ID!) {
    getMyThing(id: $id) {
      id
      name
      status
    }
  }
`);

type GetMyThingQuery = ResultOf<typeof GET_MY_THING>;

// Compile-time drift check between Zod schema and codegen type
const validatedMyThingSchema: ValidatedSchema<
  typeof MyThingResponseSchema,
  GetMyThingQuery
> = MyThingResponseSchema;

export const useGetMyThing = (
  id: string,
  options?: Omit<useQuery.Options, 'variables'>,
) =>
  useValidatedQuery(GET_MY_THING, validatedMyThingSchema, {
    ...options,
    variables: { id },
    fetchPolicy: options?.fetchPolicy ?? 'network-only',
  });

export const useGetMyThingLazy = () =>
  useValidatedLazyQuery(GET_MY_THING, validatedMyThingSchema, {
    fetchPolicy: 'network-only',
  });
```

Do **not** import `gql` from `@apollo/client` or `TypedDocumentNode` manually — the `graphql()` tag replaces both.

## Zod schema location

All Zod schemas live in `packages/types/src/schemas/[domain]/` (not in `@glocal/core`). Schemas describe the GraphQL response envelope so `ValidatedSchema` can compare against the codegen operation type directly.

```tsx
// packages/types/src/schemas/myThing/myThing.schema.ts
import { z } from 'zod';

export const MyThingSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const MyThingResponseSchema = z.object({
  getMyThing: MyThingSchema,
});

export type MyThing = z.infer<typeof MyThingSchema>;
```

Export from `packages/types/src/index.ts` so consumers can `import { MyThingResponseSchema } from '@glocal/types'`.

## Consuming the hook

```tsx
const { data, loading, error } = useGetMyThing(id);
// data: z.infer<typeof MyThingResponseSchema> | undefined
// error: { message: string; code?: string } | undefined
```

## Lazy / imperative

```tsx
const { executeValidatedQuery } = useGetMyThingLazy();
const response = await executeValidatedQuery({ variables: { id } });
if (response.error) { /* handle */ }
const thing = response.data;
```

## Mutations

```tsx
// packages/core/src/queries/[domain]/useDoMyThing.ts
import { DoMyThingResponseSchema, MyThingInput } from '@glocal/types';
import type { ValidatedSchema } from '@glocal/types';

import { graphql, type ResultOf } from '@graphql';
import { useValidatedMutation } from '@queries/useValidatedMutation';

const DO_MY_THING = graphql(`
  mutation DoMyThing($input: MyThingInput!) {
    doMyThing(input: $input) {
      id
      name
    }
  }
`);

type DoMyThingMutation = ResultOf<typeof DO_MY_THING>;

const validatedDoMyThingSchema: ValidatedSchema<
  typeof DoMyThingResponseSchema,
  DoMyThingMutation
> = DoMyThingResponseSchema;

export const useDoMyThing = () => {
  const [mutate, result] = useValidatedMutation(DO_MY_THING, validatedDoMyThingSchema);

  const doMyThing = async (input: MyThingInput) =>
    mutate({ variables: { input } });

  return { doMyThing, ...result };
};
```

Input types (e.g. `MyThingInput`) are hand-written in `@glocal/types` and used for hook parameter typing. The `graphql()` tag still validates them against the schema at build time.

## After changing a query or the backend schema

1. Backend schema changed: `yarn schema:sync` from repo root — emits `packages/core/src/generated/schema.graphql` then runs core's codegen.
2. Only a `graphql()` document changed: `yarn workspace @glocal/core codegen`.
3. TypeScript will surface `__schema_drift__` errors on any `ValidatedSchema` binding whose Zod shape no longer matches the generated operation type — fix the Zod schema.

## Authentication

- `authLink` in `packages/core/src/client/` automatically injects `Authorization: Bearer <token>` into every request. No manual header work in query hooks.
- `errorLink` intercepts `UNAUTHENTICATED` errors, calls `useRenewSession`, and retries the original operation automatically.
- Opt out of auth for a single call with `context: { skipAuth: true, maxRetries: 0 }` (see `useSignIn`).

## Query file conventions

- One hook per file, named `useVerbNoun` (e.g. `useGetUser`, `useCreateTransaction`).
- Files in `packages/core/src/queries/[domain]/`.
- Domains: `auth/`, `user/`, `kyc/`, `assets/`, `transactions/`, `portfolio/`, `account/`, `countries/`, `files/`, `terms/`, `market/`.
- Export both eager (`useGetX`) and lazy (`useGetXLazy`) variants when both are needed.
