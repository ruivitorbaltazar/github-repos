import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
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
    marginRight: 4,
  },
  ownerName: {
    fontSize: 14,
  },
  languageText: {
    fontSize: 12,
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
    fontSize: 16,
  },
})

export { styles }
