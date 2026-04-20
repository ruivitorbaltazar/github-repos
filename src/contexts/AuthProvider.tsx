import React, { useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"
import { AuthContext } from "@/contexts/AuthContext"
import { setAuthToken } from "@/services/github/client"

const TOKEN_KEY = "github_token"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY).then((stored) => {
      if (stored) {
        setAuthToken(stored)
        setToken(stored)
      }
      setIsLoading(false)
    })
  }, [])

  const login = async (newToken: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken)
    setAuthToken(newToken)
    setToken(newToken)
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    setAuthToken(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
