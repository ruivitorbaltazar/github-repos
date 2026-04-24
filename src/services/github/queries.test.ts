import { repositoriesQuery, languagesQuery } from "./queries"

describe("repositoriesQuery", () => {
  it("includes search and language in queryKey", () => {
    const q = repositoriesQuery({ search: "react", language: "ts" })
    expect(q.queryKey).toEqual(["repositories", { search: "react", language: "ts" }])
    expect(q.initialPageParam).toBe(1)
    expect(typeof q.getNextPageParam).toBe("function")
  })

  it("returns next page number when more results available", () => {
    const q = repositoriesQuery({ search: "", language: "" })
    const next = q.getNextPageParam!({ items: [], total_count: 1000, page: 1 }, [], 1, [])
    expect(next).toBe(2)
  })

  it("returns undefined when no more pages", () => {
    const q = repositoriesQuery({ search: "", language: "" })
    const next = q.getNextPageParam!({ items: [], total_count: 10, page: 1 }, [], 1, [])
    expect(next).toBeUndefined()
  })
})

describe("languagesQuery", () => {
  it("uses stable queryKey and 10 min stale time", () => {
    const q = languagesQuery()
    expect(q.queryKey).toEqual(["languages"])
    expect(q.staleTime).toBe(1000 * 60 * 10)
  })
})
