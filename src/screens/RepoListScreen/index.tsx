import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { useRepositories } from "@/hooks/useRepositories"
import { useTheme } from "@/hooks/useTheme"

import { RepoCard } from "@/components/RepoCard"
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton"
import { Banner } from "@/components/Banner"

import { Repository } from "@/types/repository"
import { RootStackParamList } from "@/types/navigation"

import { styles } from "./styles"

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RepoList"
>

const RepoListScreen = () => {
  const { theme } = useTheme()

  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState("typescript")

  const [shouldShowNetworkBanner, setShouldShowNetworkBanner] = useState(false)

  const {
    reposData,
    reposAreFetching,
    reposError,
  } = useRepositories({ search, language })

  const navigation = useNavigation<NavigationProp>()

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
        Oops!
      </Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        Something went wrong while fetching repositories.
      </Text>
      <Text style={[styles.errorBody, { color: theme.textSecondary }]}>
        "{reposError?.message || "Unknown error"}"
      </Text>
      {/* TODO: Implement retry logic */}
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

  const renderFilterBar = () => (
    <View style={styles.filterBar}>
      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Search repositories:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search repositories..."
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

      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Filter by language:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Filter by language (e.g. typescript)"
          value={language}
          onChangeText={setLanguage}
          style={[styles.input, { backgroundColor: theme.bgTertiary, color: theme.textPrimary }]}
        />
        {language ? (
          <TouchableOpacity onPress={() => setLanguage("")} style={[styles.clearButton, { backgroundColor: theme.bgSecondary }]}>
            <Text style={[styles.clearButtonText, { color: theme.textTertiary }]}>╳</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )

  const renderList = () => {
    if (reposAreFetching) {
      return renderLoading()
    }

    if (reposError && reposError.message !== "Network Error") {
      return renderError()
    }

    if (!reposData || reposData.length === 0) {
      return renderEmpty()
    }

    return (
      <FlatList
        data={reposData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
      />
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      {shouldShowNetworkBanner ? (
        <Banner message="Network error, please check your connection" />
      ) : null}
      {renderFilterBar()}
      {renderList()}
    </View>
  )
}

export default RepoListScreen
