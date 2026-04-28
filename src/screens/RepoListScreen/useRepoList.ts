import { useCallback, useMemo, useState } from "react"
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useTranslation } from "react-i18next"
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  AnimatedStyle,
} from "react-native-reanimated"
import { FlashListRef } from "@shopify/flash-list"
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
  | { kind: "networkError" }
  | { kind: "error"; message: string }

type LanguagesStatus =
  | { status: "loading" }
  | { status: "ready"; items: string[] }

type FabState = {
  visible: boolean
  animatedStyle: AnimatedStyle<{ opacity: number }>
}

type State = {
  async: AsyncStatus
  search: string
  language: string
  languages: LanguagesStatus
  isRefreshing: boolean
  fab: FabState
}

type Actions = {
  setSearch: (v: string) => void
  toggleLanguage: (lang: string) => void
  loadMore: () => void
  openRepo: (r: Repository) => void
  retry: () => void
  refresh: () => void
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  scrollToTop: (ref: FlashListRef<Repository> | null) => void
}

const DEFAULT_LANGUAGE = "typescript"
const FAB_SCROLL_THRESHOLD = 300

export const useRepoList = (): { state: State; actions: Actions } => {
  const navigation = useNavigation<NavigationProp>()
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const { t } = useTranslation()
  const debouncedSearch = useDebounce(search)

  const reposQ = useInfiniteQuery(repositoriesQuery({ search: debouncedSearch, language }))
  const langsQ = useQuery(languagesQuery())

  const fabOpacity = useSharedValue(0)
  const [fabVisible, setFabVisible] = useState(false)
  const fabAnimatedStyle = useAnimatedStyle(() => ({ opacity: fabOpacity.value }))

  const repos = useMemo(
    () => reposQ.data?.pages.flatMap((p) => p.items) ?? [],
    [reposQ.data]
  )

  const asyncStatus = useMemo<AsyncStatus>(() => {
    if (reposQ.error) {
      const isNetworkError = reposQ.error.message === t("repoList.networkError")
      if (isNetworkError) return { kind: "networkError" }
      return { kind: "error", message: reposQ.error.message || t("repoList.unknownError") }
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
  }, [reposQ.error, reposQ.isFetching, reposQ.isFetchingNextPage, reposQ.hasNextPage, repos, t])

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

  const toggleLanguage = useCallback((lang: string) => {
    const normalized = lang.toLowerCase()
    setLanguage((current) => (current === normalized ? DEFAULT_LANGUAGE : normalized))
  }, [])

  const retry = useCallback(() => {
    reposQ.refetch()
  }, [reposQ])

  const refresh = useCallback(() => {
    reposQ.refetch()
  }, [reposQ])

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y
      const shouldShow = y > FAB_SCROLL_THRESHOLD
      fabOpacity.value = withTiming(shouldShow ? 1 : 0, { duration: 200 })
      setFabVisible(shouldShow)
    },
    [fabOpacity]
  )

  const scrollToTop = useCallback((ref: FlashListRef<Repository> | null) => {
    ref?.scrollToTop({ animated: true })
  }, [])

  const isRefreshing = reposQ.isRefetching && !reposQ.isFetchingNextPage

  return {
    state: {
      async: asyncStatus,
      search,
      language,
      languages,
      isRefreshing,
      fab: { visible: fabVisible, animatedStyle: fabAnimatedStyle },
    },
    actions: {
      setSearch,
      toggleLanguage,
      loadMore,
      openRepo,
      retry,
      refresh,
      onScroll,
      scrollToTop,
    },
  }
}

export type { State as RepoListState, Actions as RepoListActions, AsyncStatus }
