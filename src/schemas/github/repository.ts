import { z } from "zod"

export const RepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  language: z.string().nullable(),
  html_url: z.string().url(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  owner: z.object({
    login: z.string(),
    avatar_url: z.string().url(),
  }),
})

export const SearchRepositoriesResponseSchema = z.object({
  items: z.array(RepositorySchema),
})

export type Repository = z.infer<typeof RepositorySchema>
