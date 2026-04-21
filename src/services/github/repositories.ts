import { QueryFunctionContext } from "@tanstack/react-query"
import { Repository } from "@/types/repository"
import { githubClient } from "./client"

export type RepoQueryKey = readonly ["repositories", { search: string; language: string }]

export const fetchRepositories = async ({ queryKey }: QueryFunctionContext<RepoQueryKey>): Promise<Repository[]> => {
  const [_key, { search, language }] = queryKey
  const query = [
    search,
    language ? `language:${language}` : "",
  ].filter(Boolean).join(" ")

  const response = await githubClient.get(
    "/search/repositories",
    {
      params: {
        q: query,
        sort: "stars",
        order: "desc",
      },
    }
  )

  return response.data.items
}
