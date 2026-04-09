import { StyleSheet } from "react-native"
import { styles as stylesMain } from "@/components/RepoCard/styles"

const styles = StyleSheet.create({
  name: {
    ...stylesMain.name,
    height: 24,
    width: 120,
    borderRadius: 6,
  },
  description: {
    ...stylesMain.description,
    height: 48,
    borderRadius: 6,
  },
  starsText: {
    ...stylesMain.starsText,
    height: 16,
    flexGrow: 1,
    borderRadius: 6,
  },
  ownerAvatar: {
    ...stylesMain.ownerAvatar,
  },
  ownerName: {
    ...stylesMain.ownerName,
    height: 16,
    flexGrow: 1,
    borderRadius: 6,
  },
  languageText: {
    ...stylesMain.languageText,
    height: 16,
    flexGrow: 1,
    borderRadius: 6,
  },
})

export { styles }
