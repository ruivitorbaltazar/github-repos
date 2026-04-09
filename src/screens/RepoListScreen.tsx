import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { useRepositories } from "@/hooks/useRepositories"

import { RepoCard } from "@/components/RepoCard"
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton"
import { Banner } from "@/components/Banner"

import { Repository } from "@/types/repository"
import { RootStackParamList } from "@/types/navigation"

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RepoList"
>

const RepoListScreen = () => {
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState("typescript")

  const [shouldShowNetworkBanner, setShouldShowNetworkBanner] = useState(false)

  const {
    reposData,
    reposAreFetching,
    reposError,
  } = useRepositories({ search, language })

  const navigation = useNavigation<NavigationProp>()

  const colorScheme = useColorScheme()
  const styles = colorScheme === "dark" ? stylesDark : stylesLight

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
      <Text style={styles.errorTitle}>
        Oops!
      </Text>
      <Text style={styles.errorBody}>
        Something went wrong while fetching repositories.
      </Text>
      <Text style={styles.errorBody}>
        "{reposError?.message || "Unknown error"}"
      </Text>
      {/* TODO: Implement retry logic */}
      <TouchableOpacity style={styles.errorAction} onPress={() => console.log("Trying again")}>
        <Text style={styles.errorActionText}>Try again</Text>
      </TouchableOpacity>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.error}>
      <Text style={styles.errorTitle}>
        No repositories found
      </Text>
      <Text style={styles.errorBody}>
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
      <Text style={styles.inputLabel}>Search repositories:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search repositories..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>╳</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={styles.inputLabel}>Filter by language:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Filter by language (e.g. typescript)"
          value={language}
          onChangeText={setLanguage}
          style={styles.input}
        />
        {language ? (
          <TouchableOpacity onPress={() => setLanguage("")} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>╳</Text>
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
    <View style={styles.container}>
      {shouldShowNetworkBanner ? (
        <Banner message="Network error, please check your connection" />
      ) : null}
      {renderFilterBar()}
      {renderList()}
    </View>
  )
}

const stylesLight = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
  },
  errorBody: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  errorAction: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterBar: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    marginBottom: 8,
    flexDirection: "column",
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginTop: 12,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  input: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  clearButton: {
    marginLeft: 8,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 12,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 12,
  },
})

const stylesDark = StyleSheet.create({
  container: {
    ...stylesLight.container,
    backgroundColor: "#111",
  },
  error: {
    ...stylesLight.error,
  },
  errorTitle: {
    ...stylesLight.errorTitle,
    color: "#fff",
  },
  errorBody: {
    ...stylesLight.errorBody,
    color: "#aaa",
  },
  errorAction: {
    ...stylesLight.errorAction,
  },
  errorActionText: {
    ...stylesLight.errorActionText,
    color: "#fff",
  },
  filterBar: {
    ...stylesLight.filterBar,
  },
  inputLabel: {
    ...stylesLight.inputLabel,
    color: "#aaa",
  },
  inputContainer: {
    ...stylesLight.inputContainer,
  },
  input: {
    ...stylesLight.input,
    backgroundColor: "#333",
    color: "#fff",
  },
  clearButton: {
    ...stylesLight.clearButton,
    backgroundColor: "#555",
  },
  clearButtonText: {
    ...stylesLight.clearButtonText,
    color: "#fff",
  },
})

export default RepoListScreen
