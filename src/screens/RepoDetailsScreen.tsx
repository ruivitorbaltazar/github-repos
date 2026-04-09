import {
  View,
  Text,
  Linking,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"

import { RootStackParamList } from "@/types/navigation"

const RepoDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "RepoDetails">>()
  const { repo } = route.params

  const colorScheme = useColorScheme()
  const styles = colorScheme === "dark" ? stylesDark : stylesLight

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

const stylesLight = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    flexDirection: "column",
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

const stylesDark = StyleSheet.create({
  container: {
    ...stylesLight.container,
    backgroundColor: "#333",
  },
  header: {
    ...stylesLight.header,
  },
  subheader: {
    ...stylesLight.subheader,
  },
  title: {
    ...stylesLight.title,
    color: "#fff",
  },
  stars: {
    ...stylesLight.stars,
  },
  starsIcon: {
    ...stylesLight.starsIcon,
  },
  starsText: {
    ...stylesLight.starsText,
    color: "#fff",
  },
  description: {
    ...stylesLight.description,
    color: "#ccc",
  },
  owner: {
    ...stylesLight.owner,
  },
  ownerAvatar: {
    ...stylesLight.ownerAvatar,
    backgroundColor: "#ccc",
  },
  ownerName: {
    ...stylesLight.ownerName,
    color: "#fff",
  },
  languageText: {
    ...stylesLight.languageText,
    color: "#888",
  },
  action: {
    ...stylesLight.action,
    backgroundColor: "#007AFF",
  },
  actionText: {
    ...stylesLight.actionText,
    color: "#fff",
  },
})

export default RepoDetailsScreen
