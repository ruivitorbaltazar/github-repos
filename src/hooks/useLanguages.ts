import { useQuery } from "@tanstack/react-query"
import { fetchUserLanguages } from "@/services/github/languages"

export const useLanguages = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchUserLanguages,
    staleTime: 1000 * 60 * 10,
  })

  return { languages: data ?? [], languagesLoading: isLoading }
}
