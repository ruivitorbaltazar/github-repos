import { View, Text, FlatList } from "react-native"
import { useRepositories } from "../hooks/useRepositories"

const RepoListScreen = () => {
  const {
    reposData,
    reposAreLoading,
    reposError,
  } = useRepositories()

  const renderLoading = () => <Text>Loading...</Text>
  const renderError = () => <Text>Error loading repos</Text>
  const renderCard = ({ item }: { item: any }) => { // TODO Replace 'any' with the actual type of the repository item
    const {
      name,
      description,
      language,
      stargazers_count,
      owner, // TODO Extract only avatar and profile url
    } = item

    return (
      <View style={{ padding: 12 }}>
        <Text>Name: {name}</Text>
        <Text>Description: {description}</Text>
        <Text>Language: {language}</Text>
        <Text>Stars: {stargazers_count}</Text>
        <Text>Owner: {owner.login}</Text>
      </View>
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
