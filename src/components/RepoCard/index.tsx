import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { RepoCardProps } from "@/types/repository"
import { styles } from "./styles"

const RepoCard = ({
  name,
  description,
  stars,
  language,
  owner,
  onPress,
}: RepoCardProps) => {
  const { theme } = useTheme()

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.bgTertiary, shadowColor: theme.shadowPrimary }]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.name, { color: theme.textPrimary }]}>{name}</Text>
        {description ? (
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={[styles.description, { color: theme.textSecondary }]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.stars}>
          <Text style={styles.starsIcon}>★</Text>
          <Text style={[styles.starsText, { color: theme.textSecondary }]}>{stars}</Text>
        </View>

        <View style={styles.owner}>
          <Image style={[styles.ownerAvatar, { backgroundColor: theme.bgTertiary }]} source={{ uri: owner?.avatar_url }} />
          <Text style={[styles.ownerName, { color: theme.textSecondary }]}>{owner?.login}</Text>
        </View>

        <View style={styles.language}>
          {language ? <Text style={[styles.languageText, { color: theme.textSecondary }]}>{language}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export { RepoCard }
