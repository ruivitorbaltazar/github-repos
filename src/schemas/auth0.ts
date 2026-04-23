import { z } from "zod"

export const Auth0IdTokenPayloadSchema = z
  .object({
    "https://github.com/access_token": z.string().min(1),
  })
  .transform((p) => ({ githubToken: p["https://github.com/access_token"] }))

export type Auth0IdTokenPayload = z.infer<typeof Auth0IdTokenPayloadSchema>
