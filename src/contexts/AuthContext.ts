import { createContext } from "react"
import { LoginMethod } from "@/services/auth/keys"

type Session =
  | { kind: "restoring" }
  | { kind: "anonymous" }
  | { kind: "authenticated"; token: string; method: LoginMethod }

type AuthState = { session: Session }

type AuthActions = {
  loginPAT: (token: string) => Promise<void>
  loginAuth0: () => Promise<void>
  logout: () => Promise<void>
}

type AuthContextValue = { state: AuthState; actions: AuthActions }

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export { AuthContext }
export type { AuthContextValue, AuthState, AuthActions, Session, LoginMethod }
