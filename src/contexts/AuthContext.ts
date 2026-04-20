import { createContext } from "react"

type AuthContextType = {
  token: string | null
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }
export type { AuthContextType }
