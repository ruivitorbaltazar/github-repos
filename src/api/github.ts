import axios from "axios"
import { Repository } from "../types/repository";

export const fetchRepositories = async (): Promise<Repository[]> => {
  const baseURL = "https://api.github.com/search/repositories"

  const response = await axios.get(
    baseURL,
    {
      params: {
        q: "language:typescript",
        sort: "stars",
        order: "desc",
      },
    }
  )

  return response.data.items
}
