import axios from "axios"

export const BASE_URL = process.env.EXPO_PUBLIC_GITHUB_API_BASE_URL!

export const githubClient = axios.create({
  baseURL: BASE_URL,
})

export const setAuthToken = (token: string | null) => {
  if (token) {
    githubClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete githubClient.defaults.headers.common["Authorization"]
  }
}
