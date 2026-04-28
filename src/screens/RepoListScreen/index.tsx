import { useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { FlashList, FlashListRef } from "@shopify/flash-list"
import Animated from "react-native-reanimated"

import { useTheme } from "@/hooks/useTheme"
import { useRepoList } from "./useRepoList"

import { RepoCard } from "@/components/RepoCard"
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton"
import { Banner } from "@/components/Banner"
import { Chip } from "@/components/Chip"

import { Repository } from "@/types/repository"

import { styles } from "./styles"

const RepoListScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { state, actions } = useRepoList()
  const { async: asyncStatus, search, language, languages, isRefreshing, fab } = state

  const chipsRef = useRef<FlatList<string> | null>(null)
  const repoListRef = useRef<FlashListRef<Repository> | null>(null)

  useEffect(() => {
    if (languages.status !== "ready" || !languages.items.length) return
    const index = languages.items.findIndex((l) => l.toLowerCase() === language)
    if (index < 0) return
    chipsRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 })
  }, [language, languages])

  const renderLoading = () => (
    <>
      {[...Array(5)].map((_, index) => <RepoCardSkeleton key={index} />)}
    </>
  )

  const renderError = (message: string) => (
    <View style={styles.error}>
      <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>
        {t("repoList.errorHeading")}
      </Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        {t("repoList.errorBody")}
      </Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        "{message}"
      </Text>
      <TouchableOpacity style={styles.errorAction} onPress={actions.retry}>
        <Text style={[styles.errorActionText, { color: theme.textTertiary }]}>{t("repoList.retryButton")}</Text>
      </TouchableOpacity>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.error}>
      <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>
        {t("repoList.emptyHeading")}
      </Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        {t("repoList.emptyBody")}
      </Text>
    </View>
  )

  const renderCard = ({ item }: { item: Repository }) => (
    <RepoCard
      name={item.name}
      description={item.description}
      language={item.language}
      stars={item.stargazers_count}
      owner={{ login: item.owner.login, avatar_url: item.owner.avatar_url }}
      onPress={() => actions.openRepo(item)}
    />
  )

  const renderChip = ({ item: lang }: { item: string }) => (
    <Chip
      label={lang}
      isSelected={language === lang.toLowerCase()}
      onPress={() => actions.toggleLanguage(lang)}
    />
  )

  const renderListContent = () => {
    if (asyncStatus.kind === "loading") return renderLoading()
    if (asyncStatus.kind === "error") return renderError(asyncStatus.message)
    if (asyncStatus.kind === "empty") return renderEmpty()
    return null
  }

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t("repoList.searchLabel")}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={t("repoList.searchPlaceholder")}
          value={search}
          onChangeText={actions.setSearch}
          style={[styles.input, { backgroundColor: theme.bgTertiary, color: theme.textPrimary }]}
        />
        {search ? (
          <TouchableOpacity onPress={() => actions.setSearch("")} style={[styles.clearButton, { backgroundColor: theme.bgSecondary }]}>
            <Text style={[styles.clearButtonText, { color: theme.textTertiary }]}>╳</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {languages.status === "ready" && languages.items.length > 0 && (
        <FlatList
          ref={chipsRef}
          horizontal
          data={languages.items}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          onScrollToIndexFailed={({ index }) => {
            setTimeout(() => {
              chipsRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 })
            }, 50)
          }}
          renderItem={renderChip}
        />
      )}
    </View>
  )

  const listData = asyncStatus.kind === "success" ? asyncStatus.repos : []
  const isFetchingMore = asyncStatus.kind === "success" && asyncStatus.isFetchingMore

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      {asyncStatus.kind === "networkError" ? (
        <Banner message={t("repoList.networkError")} />
      ) : null}

      {renderListHeader()}

      <FlashList
        ref={repoListRef}
        style={styles.repoList}
        data={listData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        ListEmptyComponent={renderListContent}
        ListFooterComponent={isFetchingMore ? <RepoCardSkeleton /> : null}
        onEndReached={actions.loadMore}
        onEndReachedThreshold={0.5}
        onScroll={actions.onScroll}
        scrollEventThrottle={16}
        refreshing={isRefreshing}
        onRefresh={actions.refresh}
      />

      <Animated.View
        style={[styles.fab, fab.animatedStyle]}
        pointerEvents={fab.visible ? "auto" : "none"}
      >
        <TouchableOpacity
          onPress={() => actions.scrollToTop(repoListRef.current)}
          style={styles.fabInner}
          accessibilityLabel={t("repoList.scrollToTopA11y")}
          accessibilityRole="button"
        >
          <Text style={styles.fabText}>↑</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default RepoListScreen
