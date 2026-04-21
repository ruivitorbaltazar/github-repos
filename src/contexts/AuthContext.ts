import { createContext } from "react"

type LoginMethod = "pat" | "auth0"

type AuthContextType = {
  token: string | null
  isLoading: boolean
  loginMethod: LoginMethod | null
  login: (token: string) => Promise<void>
  loginViaAuth0: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }
export type { AuthContextType, LoginMethod }
