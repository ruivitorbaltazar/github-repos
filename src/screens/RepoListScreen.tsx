import { SafeAreaView } from "react-native-safe-area-context"
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native"

import { useRepositories } from "../hooks/useRepositories"

import { RepoCard } from "../components/RepoCard"
import { RepoCardSkeleton } from "../components/RepoCardSkeleton"

import { Repository } from "../types/repository"

const RepoListScreen = () => {
  const {
    reposData,
    reposAreLoading,
    reposError,
  } = useRepositories()

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
        onPress={() => console.log("pressing card", name)}
      />
    )
  }

  const renderList = () => {
    if (reposAreLoading) {
      return renderLoading()
    }

    if (reposError) {
      return renderError()
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
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      {renderList()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
})

export default RepoListScreen
