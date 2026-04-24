import { useCallback, useState } from "react"
import { useAuth } from "@/hooks/useAuth"

type Method = "pat" | "auth0"

type Flow =
  | { kind: "idle" }
  | { kind: "submitting"; method: Method }
  | { kind: "error"; method: Method; message: string }

type State = { flow: Flow; token: string; showToken: boolean }

type Actions = {
  setToken: (v: string) => void
  toggleShowToken: () => void
  submitPAT: () => Promise<void>
  submitAuth0: () => Promise<void>
}

export const useLogin = (): { state: State; actions: Actions } => {
  const { actions: authActions } = useAuth()
  const [flow, setFlow] = useState<Flow>({ kind: "idle" })
  const [token, setTokenState] = useState("")
  const [showToken, setShowToken] = useState(false)

  const setToken = useCallback((v: string) => setTokenState(v), [])
  const toggleShowToken = useCallback(() => setShowToken((v) => !v), [])

  const submitPAT = useCallback(async () => {
    const trimmed = token.trim()
    if (!trimmed) return
    setFlow({ kind: "submitting", method: "pat" })
    try {
      await authActions.loginPAT(trimmed)
      setFlow({ kind: "idle" })
    } catch {
      setFlow({ kind: "error", method: "pat", message: "Invalid token. Please check and try again." })
    }
  }, [token, authActions])

  const submitAuth0 = useCallback(async () => {
    setFlow({ kind: "submitting", method: "auth0" })
    try {
      await authActions.loginAuth0()
      setFlow({ kind: "idle" })
    } catch (e) {
      const message = e instanceof Error ? e.message : "Auth0 login failed. Please try again."
      setFlow({ kind: "error", method: "auth0", message })
    }
  }, [authActions])

  return {
    state: { flow, token, showToken },
    actions: { setToken, toggleShowToken, submitPAT, submitAuth0 },
  }
}

export type { State as LoginState, Actions as LoginActions, Flow as LoginFlow }
