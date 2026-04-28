import { z } from "zod"

export const UserRepoSchema = z.object({
  language: z.string().nullable(),
})

export const UserReposResponseSchema = z.array(UserRepoSchema)
