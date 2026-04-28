import { UserReposResponseSchema } from "@/schemas/github/userRepo"
import { parseOrThrow } from "@/schemas/parse"
import { githubClient } from "./client"

export const fetchUserLanguages = async (): Promise<string[]> => {
  const response = await githubClient.get("/user/repos", {
    params: { per_page: 100, sort: "updated" },
  })

  let repos
  try {
    repos = parseOrThrow(UserReposResponseSchema, response.data, "github/user/repos")
  } catch (e) {
    console.warn("[fetchUserLanguages] schema validation failed", e)
    return ["TypeScript"] // return default language
  }

  const counts: Record<string, number> = {}
  for (const repo of repos) {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] ?? 0) + 1
    }
  }

  const sorted = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([lang]) => lang)

  const tsIndex = sorted.findIndex((l) => l.toLowerCase() === "typescript")
  if (tsIndex > 0) {
    sorted.unshift(sorted.splice(tsIndex, 1)[0])
  } else if (tsIndex === -1) {
    sorted.unshift("TypeScript")
  }

  return sorted
}
