import { View, Text, StyleSheet, useColorScheme } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { styles as stylesMain } from "@/components/RepoCard/styles"
import { styles } from "./styles"

const RepoCardSkeleton = () => {
  const { theme } = useTheme()

  return (
    <View style={[stylesMain.card, { backgroundColor: theme.bgTertiary, shadowColor: theme.shadowPrimary }]}>
      <View>
        <View style={[styles.name, { backgroundColor: theme.bgPrimary }]} />
        <View style={[styles.description, { backgroundColor: theme.bgPrimary }]} />
      </View>

      <View style={stylesMain.footer}>
        <View style={stylesMain.stars}>
          <Text style={[stylesMain.starsIcon, { color: theme.textTertiary }]}>★</Text>
          <View style={[styles.starsText, { backgroundColor: theme.bgPrimary }]} />
        </View>

        <View style={stylesMain.owner}>
          <View style={[styles.ownerAvatar, { backgroundColor: theme.bgPrimary }]} />
          <View style={[styles.ownerName, { backgroundColor: theme.bgPrimary }]} />
        </View>

        <View style={stylesMain.language}>
          <View style={[styles.languageText, { backgroundColor: theme.bgPrimary }]} />
        </View>
      </View>
    </View>
  )
}

export { RepoCardSkeleton }
