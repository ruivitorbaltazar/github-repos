import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2, // android shadow
    flexDirection: "column",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginVertical: 6,
  },
  footer: {
    flexDirection: "row",
    height: 24,
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
    flex: 4,
  },
  starsIcon: {
    fontSize: 16,
    color: "#FFD700",
  },
  starsText: {
    marginLeft: 4,
    fontSize: 14,
  },
  owner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    flex: 9,
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
  language: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 4,
  },
  languageText: {
    fontSize: 12,
  },
})

export { styles }
