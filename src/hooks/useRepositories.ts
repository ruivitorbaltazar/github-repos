import { useQuery } from "@tanstack/react-query"
import { fetchRepositories } from "../api/github"

export const useRepositories = () => {
  const refetchInterval = 60000 // 1 minute

  const { data, isLoading, error } = useQuery({
    queryKey: ["repositories"],
    queryFn: fetchRepositories,
    refetchInterval: refetchInterval,
  })

  return {
    reposData: data,
    reposAreLoading: isLoading,
    reposError: error,
  }
}
