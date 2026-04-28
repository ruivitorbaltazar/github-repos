import * as SecureStore from "expo-secure-store"
import { setAuthToken } from "@/services/github/client"
import { validateToken } from "@/services/github/auth"
import { loginWithAuth0, logoutFromAuth0 } from "@/services/auth/auth0"
import { TOKEN_KEY, LOGIN_METHOD_KEY, LoginMethod } from "@/services/auth/keys"

type Session =
  | { kind: "anonymous" }
  | { kind: "authenticated"; token: string; method: LoginMethod }

const restore = async (): Promise<Session> => {
  const [storedToken, storedMethod] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(LOGIN_METHOD_KEY),
  ])
  if (!storedToken) return { kind: "anonymous" }
  setAuthToken(storedToken)
  return { kind: "authenticated", token: storedToken, method: (storedMethod as LoginMethod) ?? "pat" }
}

const saveSession = async (token: string, method: LoginMethod): Promise<void> => {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, token),
    SecureStore.setItemAsync(LOGIN_METHOD_KEY, method),
  ])
  setAuthToken(token)
}

const clearSession = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(LOGIN_METHOD_KEY),
  ])
  setAuthToken(null)
}

const loginWithPAT = async (token: string): Promise<Session> => {
  const trimmed = token.trim()
  await validateToken(trimmed)
  await saveSession(trimmed, "pat")
  return { kind: "authenticated", token: trimmed, method: "pat" }
}

const loginViaAuth0 = async (): Promise<Session> => {
  const githubToken = await loginWithAuth0()
  await saveSession(githubToken, "auth0")
  return { kind: "authenticated", token: githubToken, method: "auth0" }
}

const logout = async (method: LoginMethod | null): Promise<void> => {
  if (method === "auth0") {
    await logoutFromAuth0()
  }
  await clearSession()
}

export const authRepository = {
  restore,
  loginWithPAT,
  loginViaAuth0,
  logout,
}

export type { Session }
