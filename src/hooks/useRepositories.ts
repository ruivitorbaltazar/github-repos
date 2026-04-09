import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query"
import { fetchRepositories } from "@/api/github"
import { Repository } from "@/types/repository"

export const useRepositories = ({ search, language }: { search: string; language: string }) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const refetchInterval = 60000 // 1 minute

  const { data, isFetching, error } = useQuery<Repository[]>({
    queryKey: ["repositories", { search: debouncedSearch, language }],
    queryFn: fetchRepositories,
    refetchInterval: refetchInterval,
    placeholderData: (previousData) => previousData,
  })

  return {
    reposData: data,
    reposAreFetching: isFetching,
    reposError: error,
  }
}
