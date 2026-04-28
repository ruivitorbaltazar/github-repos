import * as SecureStore from "expo-secure-store"
import { authRepository } from "./authRepository"
import { TOKEN_KEY, LOGIN_METHOD_KEY } from "./keys"
import { setAuthToken } from "@/services/github/client"
import { validateToken } from "@/services/github/auth"
import { loginWithAuth0, logoutFromAuth0 } from "@/services/auth/auth0"

jest.mock("@/services/github/client", () => ({ setAuthToken: jest.fn() }))
jest.mock("@/services/github/auth", () => ({ validateToken: jest.fn() }))
jest.mock("@/services/auth/auth0", () => ({
  loginWithAuth0: jest.fn(),
  logoutFromAuth0: jest.fn(),
}))

const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>

beforeEach(() => {
  jest.clearAllMocks()
})

describe("authRepository.restore", () => {
  it("returns anonymous when no token", async () => {
    mockedSecureStore.getItemAsync.mockResolvedValue(null)
    const session = await authRepository.restore()
    expect(session).toEqual({ kind: "anonymous" })
    expect(setAuthToken).not.toHaveBeenCalled()
  })

  it("returns authenticated with method when token stored", async () => {
    mockedSecureStore.getItemAsync.mockImplementation(async (k) =>
      k === TOKEN_KEY ? "tok" : k === LOGIN_METHOD_KEY ? "auth0" : null
    )
    const session = await authRepository.restore()
    expect(session).toEqual({ kind: "authenticated", token: "tok", method: "auth0" })
    expect(setAuthToken).toHaveBeenCalledWith("tok")
  })
})

describe("authRepository.loginWithPAT", () => {
  it("validates then saves", async () => {
    ;(validateToken as jest.Mock).mockResolvedValue(undefined)
    const session = await authRepository.loginWithPAT("  abc  ")
    expect(validateToken).toHaveBeenCalledWith("abc")
    expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith(TOKEN_KEY, "abc")
    expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith(LOGIN_METHOD_KEY, "pat")
    expect(setAuthToken).toHaveBeenCalledWith("abc")
    expect(session).toEqual({ kind: "authenticated", token: "abc", method: "pat" })
  })

  it("throws when validate fails", async () => {
    ;(validateToken as jest.Mock).mockRejectedValue(new Error("bad"))
    await expect(authRepository.loginWithPAT("x")).rejects.toThrow()
    expect(mockedSecureStore.setItemAsync).not.toHaveBeenCalled()
  })
})

describe("authRepository.loginViaAuth0", () => {
  it("persists the returned GitHub token", async () => {
    ;(loginWithAuth0 as jest.Mock).mockResolvedValue("gh-token")
    const session = await authRepository.loginViaAuth0()
    expect(session).toEqual({ kind: "authenticated", token: "gh-token", method: "auth0" })
    expect(setAuthToken).toHaveBeenCalledWith("gh-token")
  })
})

describe("authRepository.logout", () => {
  it("clears storage and token", async () => {
    await authRepository.logout("pat")
    expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_KEY)
    expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith(LOGIN_METHOD_KEY)
    expect(setAuthToken).toHaveBeenCalledWith(null)
    expect(logoutFromAuth0).not.toHaveBeenCalled()
  })

  it("logs out of auth0 when method is auth0", async () => {
    await authRepository.logout("auth0")
    expect(logoutFromAuth0).toHaveBeenCalled()
  })
})
