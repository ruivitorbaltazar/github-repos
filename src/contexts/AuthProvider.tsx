import React, { useCallback, useEffect, useMemo, useState } from "react"
import { AuthContext, AuthActions, AuthState, Session } from "@/contexts/AuthContext"
import { authRepository } from "@/services/auth/authRepository"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session>({ kind: "restoring" })

  useEffect(() => {
    authRepository.restore().then(setSession)
  }, [])

  const loginPAT = useCallback(async (token: string) => {
    const next = await authRepository.loginWithPAT(token)
    setSession(next)
  }, [])

  const loginAuth0 = useCallback(async () => {
    const next = await authRepository.loginViaAuth0()
    setSession(next)
  }, [])

  const logout = useCallback(async () => {
    const method = session.kind === "authenticated" ? session.method : null
    await authRepository.logout(method)
    setSession({ kind: "anonymous" })
  }, [session])

  const state = useMemo<AuthState>(() => ({ session }), [session])
  const actions = useMemo<AuthActions>(() => ({ loginPAT, loginAuth0, logout }), [loginPAT, loginAuth0, logout])

  return (
    <AuthContext.Provider value={{ state, actions }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
