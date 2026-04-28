import { useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { useRepositories } from "@/hooks/useRepositories"
import { useLanguages } from "@/hooks/useLanguages"
import { useTheme } from "@/hooks/useTheme"

import { RepoCard } from "@/components/RepoCard"
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton"
import { Banner } from "@/components/Banner"
import { Chip } from "@/components/Chip"

import { Repository } from "@/types/repository"
import { RootStackParamList } from "@/types/navigation"

import { styles } from "./styles"

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RepoList"
>

const RepoListScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState("typescript")

  const [shouldShowNetworkBanner, setShouldShowNetworkBanner] = useState(false)

  const { languages, languagesLoading } = useLanguages()

  const {
    reposData,
    reposAreFetching,
    reposFetchingNextPage,
    reposError,
    fetchNextPage,
    hasNextPage,
  } = useRepositories({ search, language })

  const navigation = useNavigation<NavigationProp>()

  const chipsRef = useRef<FlatList<string> | null>(null)

  useEffect(() => {
    if (!languages.length) return
    const index = languages.findIndex((l) => l.toLowerCase() === language)
    if (index < 0) return
    chipsRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 })
  }, [language, languages])

  useEffect(() => {
    if (reposError && reposError.message === "Network Error") {
      console.log('network error!');
      setShouldShowNetworkBanner(true)
    } else {
      setShouldShowNetworkBanner(false)
    }
  }, [reposError])

  const renderLoading = () => (
    <>
      {[...Array(5)].map((_, index) => <RepoCardSkeleton key={index} />)}
    </>
  )

  const renderError = () => (
    <View style={styles.error}>
      <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>
        {t("repoList.errorHeading")}
      </Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        {t("repoList.errorBody")}
      </Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        "{reposError?.message || t("repoList.unknownError")}"
      </Text>
      {/* TODO: Implement retry logic */}
      <TouchableOpacity style={styles.errorAction} onPress={() => console.log("Trying again")}>
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

  const renderCard = ({ item }: { item: Repository }) => {
    const {
      name,
      description,
      language,
      stargazers_count,
      owner,
    } = item

    return (
      <RepoCard
        name={name}
        description={description}
        language={language}
        stars={stargazers_count}
        owner={{ login: owner.login, avatar_url: owner.avatar_url }}
        onPress={() => navigation.navigate("RepoDetails", { repo: item })}
      />
    )
  }

  const renderChip = ({ item: lang }: { item: string }) => {
    const isSelected = language === lang.toLowerCase()
    return (
      <Chip
        label={lang}
        isSelected={isSelected}
        onPress={() => setLanguage(isSelected ? "typescript" : lang.toLowerCase())}
      />
    )
  }

  const renderListContent = () => {
    if (reposAreFetching) return renderLoading()
    if (reposError && reposError.message !== "Network Error") return renderError()
    if (!reposData || reposData.length === 0) return renderEmpty()
    return null
  }

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t("repoList.searchLabel")}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={t("repoList.searchPlaceholder")}
          value={search}
          onChangeText={setSearch}
          style={[styles.input, { backgroundColor: theme.bgTertiary, color: theme.textPrimary }]}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")} style={[styles.clearButton, { backgroundColor: theme.bgSecondary }]}>
            <Text style={[styles.clearButtonText, { color: theme.textTertiary }]}>╳</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {!languagesLoading && languages.length > 0 && (
        <FlatList
          ref={chipsRef}
          horizontal
          data={languages}
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

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      {shouldShowNetworkBanner ? (
        <Banner message={t("repoList.networkError")} />
      ) : null}

      {renderListHeader()}

      <FlatList
        style={styles.repoList}
        data={reposAreFetching || reposError || !reposData?.length ? [] : reposData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        ListEmptyComponent={renderListContent}
        onEndReached={() => { if (hasNextPage && !reposFetchingNextPage) fetchNextPage() }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={reposFetchingNextPage ? <RepoCardSkeleton /> : null}
      />
    </View>
  )
}

export default RepoListScreen
