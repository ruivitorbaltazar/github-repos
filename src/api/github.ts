import axios from "axios"
import { Repository } from "../types/repository"

export const fetchRepositories = async ({ queryKey }: any): Promise<Repository[]> => { // remove any and add proper type for queryKey
  const baseURL = "https://api.github.com/search/repositories"

  const [_key, { search, language }] = queryKey
  const query = [
    search,
    language ? `language:${language}` : "",
  ].filter(Boolean).join(" ")

  const response = await axios.get(
    baseURL,
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
