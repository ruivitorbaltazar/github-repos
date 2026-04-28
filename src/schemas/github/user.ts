import { z } from "zod"

export const GitHubUserSchema = z.object({
  id: z.number(),
  login: z.string(),
})

export type GitHubUser = z.infer<typeof GitHubUserSchema>
