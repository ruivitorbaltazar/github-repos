import { QueryFunctionContext } from "@tanstack/react-query"
import { RepositoriesPage } from "@/types/repository"
import { SearchRepositoriesResponseSchema } from "@/schemas/github/repository"
import { parseOrThrow } from "@/schemas/parse"
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

  try {
    const searchRepos = parseOrThrow(SearchRepositoriesResponseSchema, response.data, "github/search")
    return {
      items: searchRepos.items,
      total_count: searchRepos.total_count,
      page: pageParam,
    }
  } catch (e) {
    console.warn("[fetchRepositories] schema validation failed", e)
    return { items: [], total_count: 0, page: pageParam }
  }
}
