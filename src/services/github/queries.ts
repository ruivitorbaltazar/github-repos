import { InfiniteData, UseInfiniteQueryOptions, UseQueryOptions } from "@tanstack/react-query"
import { fetchRepositories, PER_PAGE, RepoQueryKey } from "@/services/github/repositories"
import { fetchUserLanguages } from "@/services/github/languages"
import { RepositoriesPage } from "@/types/repository"

const REFETCH_INTERVAL = 60_000
const LANGUAGES_STALE_TIME = 1000 * 60 * 10

export const repositoriesQuery = ({
  search,
  language,
}: {
  search: string
  language: string
}): UseInfiniteQueryOptions<RepositoriesPage, Error, InfiniteData<RepositoriesPage>, RepoQueryKey, number> => ({
  queryKey: ["repositories", { search, language }] as const,
  queryFn: fetchRepositories,
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    const fetchedCount = lastPage.page * PER_PAGE
    return fetchedCount < lastPage.total_count ? lastPage.page + 1 : undefined
  },
  refetchInterval: REFETCH_INTERVAL,
})

export const languagesQuery = (): UseQueryOptions<string[], Error, string[], readonly ["languages"]> => ({
  queryKey: ["languages"] as const,
  queryFn: fetchUserLanguages,
  staleTime: LANGUAGES_STALE_TIME,
})
