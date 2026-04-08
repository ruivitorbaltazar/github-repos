import { View, Text, StyleSheet } from "react-native"
import { styles as stylesMain } from "../components/RepoCard"

const RepoCardSkeleton = () => (
  <View style={stylesMain.card}>
    <View>
      <View style={styles.name} />
      <View style={styles.description} />
    </View>

    <View style={stylesMain.footer}>
      <View style={stylesMain.stars}>
        <Text style={styles.starsIcon}>★</Text>
        <View style={styles.starsText} />
      </View>

      <View style={stylesMain.owner}>
        <View style={styles.ownerAvatar} />
        <View style={styles.ownerName} />
      </View>

      <View style={stylesMain.language}>
        <View style={styles.languageText} />
      </View>
    </View>
  </View>
)

const styles = StyleSheet.create({
  name: {
    ...stylesMain.name,
    height: 24,
    width: 120,
    backgroundColor: "whitesmoke",
    borderRadius: 6,
  },
  description: {
    ...stylesMain.description,
    height: 48,
    backgroundColor: "whitesmoke",
    borderRadius: 6,
  },
  starsIcon: {
    ...stylesMain.starsIcon,
    color: "whitesmoke",
  },
  starsText: {
    ...stylesMain.starsText,
    height: 16,
    flexGrow: 1,
    backgroundColor: "whitesmoke",
    borderRadius: 6,
  },
  ownerAvatar: {
    ...stylesMain.ownerAvatar,
    backgroundColor: "whitesmoke",
  },
  ownerName: {
    ...stylesMain.ownerName,
    height: 16,
    flexGrow: 1,
    backgroundColor: "whitesmoke",
    borderRadius: 6,
  },
  languageText: {
    ...stylesMain.languageText,
    height: 16,
    flexGrow: 1,
    backgroundColor: "whitesmoke",
    borderRadius: 6,
  },
})

export { RepoCardSkeleton }
