import { View, Text, StyleSheet, useColorScheme } from "react-native"
import {
  stylesLight as stylesLightMain,
  stylesDark as stylesDarkMain,
} from "@/components/RepoCard"

const RepoCardSkeleton = () => {
  const colorScheme = useColorScheme()
  const stylesMain = colorScheme === "dark" ? stylesDarkMain : stylesLightMain
  const styles = colorScheme === "dark" ? stylesDark : stylesLight

  return (
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
}

const stylesLight = StyleSheet.create({
  card: { ...stylesLightMain.card },
  footer: { ...stylesLightMain.footer },
  stars: { ...stylesLightMain.stars },
  owner: { ...stylesLightMain.owner },
  language: { ...stylesLightMain.language },
  name: {
    ...stylesLightMain.name,
    height: 24,
    width: 120,
    backgroundColor: "whitesmoke",
    borderRadius: 6,
  },
  description: {
    ...stylesLightMain.description,
    height: 48,
    backgroundColor: "whitesmoke",
    borderRadius: 6,
  },
  starsIcon: {
    ...stylesLightMain.starsIcon,
    color: "whitesmoke",
  },
  starsText: {
    ...stylesLightMain.starsText,
    height: 16,
    flexGrow: 1,
    backgroundColor: "whitesmoke",
    borderRadius: 6,
  },
  ownerAvatar: {
    ...stylesLightMain.ownerAvatar,
    backgroundColor: "whitesmoke",
  },
  ownerName: {
    ...stylesLightMain.ownerName,
    height: 16,
    flexGrow: 1,
    backgroundColor: "whitesmoke",
    borderRadius: 6,
  },
  languageText: {
    ...stylesLightMain.languageText,
    height: 16,
    flexGrow: 1,
    backgroundColor: "whitesmoke",
    borderRadius: 6,
  },
})
const stylesDark = StyleSheet.create({
  card: {
    ...stylesLightMain.card,
  },
  footer: {
    ...stylesLightMain.footer,
  },
  stars: {
    ...stylesLightMain.stars,
  },
  owner: {
    ...stylesLightMain.owner,
  },
  language: {
    ...stylesLightMain.language,
  },
  name: {
    ...stylesLight.name,
    backgroundColor: "#222",
  },
  description: {
    ...stylesLight.description,
    backgroundColor: "#222",
  },
  starsIcon: {
    ...stylesLight.starsIcon,
    color: "#222",
  },
  starsText: {
    ...stylesLight.starsText,
    backgroundColor: "#222",
  },
  ownerAvatar: {
    ...stylesLight.ownerAvatar,
    backgroundColor: "#222",
  },
  ownerName: {
    ...stylesLight.ownerName,
    backgroundColor: "#222",
  },
  languageText: {
    ...stylesLight.languageText,
    backgroundColor: "#222",
  },
})

export { RepoCardSkeleton }
