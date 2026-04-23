import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query"
import { fetchRepositories, RepoQueryKey, PER_PAGE } from "@/services/github/repositories"
import { RepositoriesPage } from "@/types/repository"
import { useDebounce } from "@/hooks/useDebounce"

const REFETCH_INTERVAL = 60_000

export const useRepositories = ({ search, language }: { search: string; language: string }) => {
  const debouncedSearch = useDebounce(search)

  const { data, isFetching, isFetchingNextPage, error, fetchNextPage, hasNextPage, refetch, isRefetching } =
    useInfiniteQuery<RepositoriesPage, Error, InfiniteData<RepositoriesPage>, RepoQueryKey, number>({
      queryKey: ["repositories", { search: debouncedSearch, language }],
      queryFn: fetchRepositories,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const fetchedCount = lastPage.page * PER_PAGE
        return fetchedCount < lastPage.total_count ? lastPage.page + 1 : undefined
      },
      refetchInterval: REFETCH_INTERVAL,
    })

  return {
    reposData: data?.pages.flatMap((page) => page.items) ?? [],
    reposAreFetching: isFetching && !isFetchingNextPage,
    reposFetchingNextPage: isFetchingNextPage,
    reposError: error,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    refetch,
    isRefetching,
  }
}
