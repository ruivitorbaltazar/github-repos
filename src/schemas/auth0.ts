import { z } from "zod"

const GITHUB_TOKEN_CLAIM = process.env.EXPO_PUBLIC_AUTH0_GITHUB_TOKEN_CLAIM!

export const Auth0IdTokenPayloadSchema = z
  .object({
    [GITHUB_TOKEN_CLAIM]: z.string().min(1),
  })
  .transform((p) => ({ githubToken: p[GITHUB_TOKEN_CLAIM] }))

export type Auth0IdTokenPayload = z.infer<typeof Auth0IdTokenPayloadSchema>
