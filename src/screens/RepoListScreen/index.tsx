import { useEffect, useRef } from "react"
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native"

import { useTheme } from "@/hooks/useTheme"
import { useRepoList } from "./useRepoList"

import { RepoCard } from "@/components/RepoCard"
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton"
import { Banner } from "@/components/Banner"
import { Chip } from "@/components/Chip"

import { Repository } from "@/types/repository"

import { styles } from "./styles"

const RepoListScreen = () => {
  const { theme } = useTheme()
  const { state, actions } = useRepoList()
  const { async: asyncStatus, search, language, languages } = state

  const chipsRef = useRef<FlatList<string> | null>(null)

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
      <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>Oops!</Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        Something went wrong while fetching repositories.
      </Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        "{message}"
      </Text>
      <TouchableOpacity style={styles.errorAction} onPress={() => console.log("Trying again")}>
        <Text style={[styles.errorActionText, { color: theme.textTertiary }]}>Try again</Text>
      </TouchableOpacity>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.error}>
      <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>
        No repositories found
      </Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        We couldn't find any repositories matching your criteria.
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

  const renderChip = ({ item: lang }: { item: string }) => {
    const isSelected = language === lang.toLowerCase()
    return (
      <Chip
        label={lang}
        isSelected={isSelected}
        onPress={() => actions.setLanguage(isSelected ? "typescript" : lang.toLowerCase())}
      />
    )
  }

  const renderListContent = () => {
    if (asyncStatus.kind === "loading") return renderLoading()
    if (asyncStatus.kind === "error" && !asyncStatus.isNetworkError) return renderError(asyncStatus.message)
    if (asyncStatus.kind === "empty") return renderEmpty()
    return null
  }

  const showNetworkBanner = asyncStatus.kind === "error" && asyncStatus.isNetworkError

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Search repositories:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search repositories..."
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
      {showNetworkBanner ? (
        <Banner message="Network error, please check your connection" />
      ) : null}

      {renderListHeader()}

      <FlatList
        style={styles.repoList}
        data={listData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        ListEmptyComponent={renderListContent}
        onEndReached={actions.loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingMore ? <RepoCardSkeleton /> : null}
      />
    </View>
  )
}

export default RepoListScreen
