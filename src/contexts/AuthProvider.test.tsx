import React from "react"
import { renderHook, act, waitFor } from "@testing-library/react-native"
import { AuthProvider } from "./AuthProvider"
import { useAuth } from "@/hooks/useAuth"
import { authRepository } from "@/services/auth/authRepository"

jest.mock("@/services/auth/authRepository", () => ({
  authRepository: {
    restore: jest.fn(),
    loginWithPAT: jest.fn(),
    loginViaAuth0: jest.fn(),
    logout: jest.fn(),
  },
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

beforeEach(() => jest.clearAllMocks())

describe("AuthProvider / useAuth", () => {
  it("starts in restoring then transitions to anonymous", async () => {
    ;(authRepository.restore as jest.Mock).mockResolvedValue({ kind: "anonymous" })
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.state.session.kind).toBe("restoring")
    await waitFor(() => expect(result.current.state.session.kind).toBe("anonymous"))
  })

  it("transitions to authenticated after loginPAT", async () => {
    ;(authRepository.restore as jest.Mock).mockResolvedValue({ kind: "anonymous" })
    ;(authRepository.loginWithPAT as jest.Mock).mockResolvedValue({
      kind: "authenticated",
      token: "t",
      method: "pat",
    })
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.state.session.kind).toBe("anonymous"))
    await act(async () => {
      await result.current.actions.loginPAT("t")
    })
    expect(result.current.state.session).toEqual({
      kind: "authenticated",
      token: "t",
      method: "pat",
    })
  })

  it("logout returns to anonymous and calls repo.logout with method", async () => {
    ;(authRepository.restore as jest.Mock).mockResolvedValue({
      kind: "authenticated",
      token: "t",
      method: "auth0",
    })
    ;(authRepository.logout as jest.Mock).mockResolvedValue(undefined)
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.state.session.kind).toBe("authenticated"))
    await act(async () => {
      await result.current.actions.logout()
    })
    expect(authRepository.logout).toHaveBeenCalledWith("auth0")
    expect(result.current.state.session.kind).toBe("anonymous")
  })
})
