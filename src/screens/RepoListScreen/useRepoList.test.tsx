import React from "react"
import { renderHook, act, waitFor } from "@testing-library/react-native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useRepoList } from "./useRepoList"
import { fetchRepositories } from "@/services/github/repositories"
import { fetchUserLanguages } from "@/services/github/languages"

jest.mock("@/services/github/repositories", () => ({
  ...jest.requireActual("@/services/github/repositories"),
  fetchRepositories: jest.fn(),
}))
jest.mock("@/services/github/languages", () => ({
  fetchUserLanguages: jest.fn(),
}))
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}))

const buildWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchInterval: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

beforeEach(() => jest.clearAllMocks())

describe("useRepoList", () => {
  it("transitions to success with repos", async () => {
    ;(fetchRepositories as jest.Mock).mockResolvedValue({
      items: [{ id: 1, name: "r", full_name: "u/r", description: "", stargazers_count: 0, language: "ts", html_url: "", forks_count: 0, open_issues_count: 0, owner: { login: "u", avatar_url: "" } }],
      total_count: 1,
      page: 1,
    })
    ;(fetchUserLanguages as jest.Mock).mockResolvedValue(["TypeScript"])
    const { result } = renderHook(() => useRepoList(), { wrapper: buildWrapper() })
    await waitFor(() => expect(result.current.state.async.kind).toBe("success"))
    if (result.current.state.async.kind === "success") {
      expect(result.current.state.async.repos).toHaveLength(1)
      expect(result.current.state.async.hasMore).toBe(false)
    }
  })

  it("transitions to error with isNetworkError=true on network error", async () => {
    ;(fetchRepositories as jest.Mock).mockRejectedValue(new Error("Network Error"))
    ;(fetchUserLanguages as jest.Mock).mockResolvedValue([])
    const { result } = renderHook(() => useRepoList(), { wrapper: buildWrapper() })
    await waitFor(() => expect(result.current.state.async.kind).toBe("error"))
    if (result.current.state.async.kind === "error") {
      expect(result.current.state.async.isNetworkError).toBe(true)
    }
  })

  it("setSearch updates state", () => {
    ;(fetchRepositories as jest.Mock).mockResolvedValue({ items: [], total_count: 0, page: 1 })
    ;(fetchUserLanguages as jest.Mock).mockResolvedValue([])
    const { result } = renderHook(() => useRepoList(), { wrapper: buildWrapper() })
    act(() => result.current.actions.setSearch("react"))
    expect(result.current.state.search).toBe("react")
  })
})
