import { useCallback, useMemo, useState } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useTranslation } from "react-i18next"
import { useDebounce } from "@/hooks/useDebounce"
import { repositoriesQuery, languagesQuery } from "@/services/github/queries"
import { Repository } from "@/types/repository"
import { RootStackParamList } from "@/types/navigation"

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "RepoList">

type AsyncStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; repos: Repository[]; hasMore: boolean; isFetchingMore: boolean }
  | { kind: "empty" }
  | { kind: "error"; message: string; isNetworkError: boolean }

type LanguagesStatus =
  | { status: "loading" }
  | { status: "ready"; items: string[] }

type State = {
  async: AsyncStatus
  search: string
  language: string
  languages: LanguagesStatus
}

type Actions = {
  setSearch: (v: string) => void
  setLanguage: (v: string) => void
  loadMore: () => void
  openRepo: (r: Repository) => void
}

const DEFAULT_LANGUAGE = "typescript"

export const useRepoList = (): { state: State; actions: Actions } => {
  const navigation = useNavigation<NavigationProp>()
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const { t } = useTranslation()
  const debouncedSearch = useDebounce(search)

  const reposQ = useInfiniteQuery(repositoriesQuery({ search: debouncedSearch, language }))
  const langsQ = useQuery(languagesQuery())

  const repos = useMemo(
    () => reposQ.data?.pages.flatMap((p) => p.items) ?? [],
    [reposQ.data]
  )

  const asyncStatus = useMemo<AsyncStatus>(() => {
    if (reposQ.error) {
      const isNetworkError = reposQ.error.message === t("repoList.networkError")
      return { kind: "error", message: reposQ.error.message || t("repoList.unknownError"), isNetworkError }
    }
    if (reposQ.isFetching && !reposQ.isFetchingNextPage && repos.length === 0) {
      return { kind: "loading" }
    }
    if (repos.length === 0) return { kind: "empty" }
    return {
      kind: "success",
      repos,
      hasMore: reposQ.hasNextPage ?? false,
      isFetchingMore: reposQ.isFetchingNextPage,
    }
  }, [reposQ.error, reposQ.isFetching, reposQ.isFetchingNextPage, reposQ.hasNextPage, repos])

  const languages = useMemo<LanguagesStatus>(
    () => (langsQ.isLoading ? { status: "loading" } : { status: "ready", items: langsQ.data ?? [] }),
    [langsQ.isLoading, langsQ.data]
  )

  const loadMore = useCallback(() => {
    if (reposQ.hasNextPage && !reposQ.isFetchingNextPage) reposQ.fetchNextPage()
  }, [reposQ])

  const openRepo = useCallback(
    (repo: Repository) => navigation.navigate("RepoDetails", { repo }),
    [navigation]
  )

  return {
    state: { async: asyncStatus, search, language, languages },
    actions: { setSearch, setLanguage, loadMore, openRepo },
  }
}

export type { State as RepoListState, Actions as RepoListActions, AsyncStatus }
