import { QueryFunctionContext } from "@tanstack/react-query"
import { RepositoriesPage } from "@/types/repository"
import { githubClient } from "./client"

export const PER_PAGE = 20

export type RepoQueryKey = readonly ["repositories", { search: string; language: string }]

export const fetchRepositories = async ({ queryKey, pageParam }: QueryFunctionContext<RepoQueryKey, number>): Promise<RepositoriesPage> => {
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
        per_page: PER_PAGE,
        page: pageParam,
      },
    }
  )

  return {
    items: response.data.items,
    total_count: response.data.total_count,
    page: pageParam,
  }
}
