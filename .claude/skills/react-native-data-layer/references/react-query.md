# react-query Patterns

Load this reference when the project uses `@tanstack/react-query` (REST or GraphQL over fetch/axios).

## Query hook

```tsx
// app/queries/[domain]/useGetMyThing.ts
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { apiClient } from '@api/client'; // project's axios/fetch client

const MyThingSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type MyThing = z.infer<typeof MyThingSchema>;

const fetchMyThing = async (id: string): Promise<MyThing> => {
  const res = await apiClient.get(`/things/${id}`);
  return MyThingSchema.parse(res.data); // throws if invalid
};

export const useGetMyThing = (id: string) =>
  useQuery({
    queryKey: ['myThing', id],
    queryFn: () => fetchMyThing(id),
  });
```

## Mutation hook

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDoMyThing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: MyThingInput) => apiClient.post('/things', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myThing'] });
    },
  });
};
```

## Authentication

Token storage via `expo-secure-store` through `localStorageUtils`:

```tsx
import { localStorageUtils } from '@utils/localStorageUtils';

const session = await localStorageUtils.getSession(); // { token, refreshToken, expiresIn }
await localStorageUtils.setSession(newSession);
await localStorageUtils.removeSession();
```

Token injection and 401 refresh-and-retry must be handled by the API client's request/response interceptors (axios) — check `app/api/` for the client setup. Do not re-implement per-hook.

## Query file conventions

- One hook per file, named `useVerbNoun` (e.g. `useGetUser`, `useCreateTransaction`).
- Files in `app/queries/[domain]/`.
- Schema files in `app/schemas/[name].schema.ts`.
- Export both eager and lazy variants when both are needed.
