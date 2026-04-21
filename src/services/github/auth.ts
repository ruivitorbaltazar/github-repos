import axios from "axios"
import { GitHubUser, GitHubUserSchema } from "@/schemas/github/user"
import { parseOrThrow } from "@/schemas/parse"
import { BASE_URL } from "./client"

export const validateToken = async (token: string): Promise<GitHubUser> => {
  const response = await axios.get(`${BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return parseOrThrow(GitHubUserSchema, response.data, "github/user")
}
