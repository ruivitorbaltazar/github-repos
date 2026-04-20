import axios from "axios"
import { BASE_URL } from "./client"

export const validateToken = async (token: string): Promise<void> => {
  await axios.get(`${BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
