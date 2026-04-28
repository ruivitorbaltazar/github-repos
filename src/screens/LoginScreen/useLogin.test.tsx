import React from "react"
import { renderHook, act, waitFor } from "@testing-library/react-native"
import { AuthProvider } from "@/contexts/AuthProvider"
import { useLogin } from "./useLogin"
import { authRepository } from "@/services/auth/authRepository"

jest.mock("@/services/auth/authRepository", () => ({
  authRepository: {
    restore: jest.fn().mockResolvedValue({ kind: "anonymous" }),
    loginWithPAT: jest.fn(),
    loginViaAuth0: jest.fn(),
    logout: jest.fn(),
  },
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

beforeEach(() => jest.clearAllMocks())

describe("useLogin", () => {
  it("submitPAT transitions idle → submitting → idle on success", async () => {
    ;(authRepository.loginWithPAT as jest.Mock).mockResolvedValue({
      kind: "authenticated",
      token: "t",
      method: "pat",
    })
    const { result } = renderHook(() => useLogin(), { wrapper })
    act(() => result.current.actions.setToken("t"))
    await act(async () => {
      await result.current.actions.submitPAT()
    })
    expect(result.current.state.flow).toEqual({ kind: "idle" })
  })

  it("submitPAT sets error flow on failure", async () => {
    ;(authRepository.loginWithPAT as jest.Mock).mockRejectedValue(new Error("nope"))
    const { result } = renderHook(() => useLogin(), { wrapper })
    act(() => result.current.actions.setToken("bad"))
    await act(async () => {
      await result.current.actions.submitPAT()
    })
    expect(result.current.state.flow.kind).toBe("error")
    if (result.current.state.flow.kind === "error") {
      expect(result.current.state.flow.method).toBe("pat")
    }
  })

  it("submitPAT is a no-op when token is blank", async () => {
    const { result } = renderHook(() => useLogin(), { wrapper })
    await act(async () => {
      await result.current.actions.submitPAT()
    })
    expect(authRepository.loginWithPAT).not.toHaveBeenCalled()
    expect(result.current.state.flow.kind).toBe("idle")
  })

  it("toggleShowToken flips showToken", () => {
    const { result } = renderHook(() => useLogin(), { wrapper })
    expect(result.current.state.showToken).toBe(false)
    act(() => result.current.actions.toggleShowToken())
    expect(result.current.state.showToken).toBe(true)
  })
})
