import {
  View,
  Text,
  Linking,
  Image,
  TouchableOpacity,
} from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"

import { RootStackParamList } from "@/types/navigation"
import { useTheme } from "@/hooks/useTheme"

import { styles } from "./styles"

const RepoDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "RepoDetails">>()
  const { repo } = route.params

  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {repo.name}
        </Text>
        <View style={styles.stars}>
          <Text style={styles.starsIcon}>★</Text>
          <Text style={[styles.starsText, { color: theme.textSecondary }]}>
            {repo.stargazers_count}
          </Text>
        </View>
      </View>

      <View style={styles.subheader}>
        <View style={styles.owner}>
          <Image style={[styles.ownerAvatar, { backgroundColor: theme.bgTertiary }]} source={{ uri: repo.owner.avatar_url }} />
          <Text style={[styles.ownerName, { color: theme.textPrimary }]}>{repo.owner.login}</Text>
        </View>
        {repo.language ? <Text style={[styles.languageText, { color: theme.textSecondary }]}>{repo.language}</Text> : null}
      </View>

      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {repo.description}
      </Text>

      <TouchableOpacity style={styles.action}>
        <Text
          style={[styles.actionText, { color: theme.textTertiary }]}
          onPress={() => Linking.openURL(repo.html_url)}
        >
          Open on GitHub
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default RepoDetailsScreen
