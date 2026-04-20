import React, { useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"
import { AuthContext, LoginMethod } from "@/contexts/AuthContext"
import { setAuthToken } from "@/services/github/client"
import { loginWithAuth0, logoutFromAuth0 } from "@/services/auth0"

const TOKEN_KEY = "github_token"
const LOGIN_METHOD_KEY = "login_method"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(LOGIN_METHOD_KEY),
    ]).then(([storedToken, storedMethod]) => {
      if (storedToken) {
        setAuthToken(storedToken)
        setToken(storedToken)
        setLoginMethod(storedMethod as LoginMethod)
      }
      setIsLoading(false)
    })
  }, [])

  const persist = async (newToken: string, method: LoginMethod) => {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, newToken),
      SecureStore.setItemAsync(LOGIN_METHOD_KEY, method),
    ])
    setAuthToken(newToken)
    setToken(newToken)
    setLoginMethod(method)
  }

  const login = async (newToken: string) => {
    await persist(newToken, "pat")
  }

  const loginViaAuth0 = async () => {
    const githubToken = await loginWithAuth0()
    await persist(githubToken, "auth0")
  }

  const logout = async () => {
    if (loginMethod === "auth0") {
      await logoutFromAuth0()
    }
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(LOGIN_METHOD_KEY),
    ])
    setAuthToken(null)
    setToken(null)
    setLoginMethod(null)
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, loginMethod, login, loginViaAuth0, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
