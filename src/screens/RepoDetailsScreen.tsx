import { View, Text, Linking, Image, TouchableOpacity, StyleSheet } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"

import { RootStackParamList } from "../types/navigation"

const RepoDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Repo Details">>()
  const { repo } = route.params

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {repo.name}
        </Text>
        <View style={styles.stars}>
          <Text style={styles.starsIcon}>★</Text>
          <Text style={styles.starsText}>
            {repo.stargazers_count}
          </Text>
        </View>
      </View>

      <View style={styles.subheader}>
        <View style={styles.owner}>
          <Image style={styles.ownerAvatar} source={{ uri: repo.owner.avatar_url }} />
          <Text style={styles.ownerName}>{repo.owner.login}</Text>
        </View>
        {repo.language ? <Text style={styles.languageText}>{repo.language}</Text> : null}
      </View>

      <Text style={styles.description}>
        {repo.description}
      </Text>

      <TouchableOpacity style={styles.action}>
        <Text
          style={styles.actionText}
          onPress={() => Linking.openURL(repo.html_url)}
        >
          Open on GitHub
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsIcon: {
    fontSize: 16,
    color: "#FFD700",
  },
  starsText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  owner: {
    flexDirection: "row",
    alignItems: "center",
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ccc",
    marginRight: 4,
  },
  ownerName: {
    fontSize: 14,
    color: "#333",
  },
  languageText: {
    fontSize: 12,
    color: "#888",
  },
  action: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
  },
})

export default RepoDetailsScreen
