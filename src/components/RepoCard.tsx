import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { RepoCardProps } from "../types/repository"

const RepoCard = ({
  name,
  description,
  stars,
  language,
  owner,
  onPress,
}: RepoCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.name}>{name}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.stars}>
          <Text style={styles.starsIcon}>★</Text>
          <Text style={styles.starsText}>{stars}</Text>

          <View style={styles.owner}>
            <Image style={styles.ownerAvatar} source={{ uri: owner?.avatar_url }} />
            <Text style={styles.ownerName}>{owner?.login}</Text>
          </View>
        </View>

        {language ? <Text style={styles.language}>{language}</Text> : null}
      </View>
    </TouchableOpacity>
  )
}

export { RepoCard }

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 150,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2, // android shadow
    flexDirection: "column",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsIcon: {
    fontSize: 16,
    color: "#FFD700",
    marginRight: 4,
  },
  starsText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
  owner: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 36,
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
  language: {
    fontSize: 12,
    color: "#888",
  },
})
