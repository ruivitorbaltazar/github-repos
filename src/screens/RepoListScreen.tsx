import { View, Text, FlatList } from "react-native"
import { useRepositories } from "../hooks/useRepositories"
import { RepoCard } from "../components/RepoCard"
import { Repository } from "../types/repository"

const RepoListScreen = () => {
  const {
    reposData,
    reposAreLoading,
    reposError,
  } = useRepositories()

  const renderLoading = () => <Text>Loading...</Text>

  const renderError = () => <Text>Error loading repos</Text>

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

export default RepoListScreen
