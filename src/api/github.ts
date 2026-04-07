import axios from "axios"

export const fetchRepositories = async () => {
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
