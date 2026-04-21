import { useQuery } from "@tanstack/react-query"
import { fetchRepositories, RepoQueryKey } from "@/services/github/repositories"
import { Repository } from "@/types/repository"
import { useDebounce } from "@/hooks/useDebounce"

const REFETCH_INTERVAL = 60_000

export const useRepositories = ({ search, language }: { search: string; language: string }) => {
  const debouncedSearch = useDebounce(search)

  const { data, isFetching, error } = useQuery<Repository[], Error, Repository[], RepoQueryKey>({
    queryKey: ["repositories", { search: debouncedSearch, language }],
    queryFn: fetchRepositories,
    refetchInterval: REFETCH_INTERVAL,
    placeholderData: (previousData) => previousData,
  })

  return {
    reposData: data,
    reposAreFetching: isFetching,
    reposError: error,
  }
}
