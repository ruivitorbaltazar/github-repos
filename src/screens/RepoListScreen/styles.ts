import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  errorBody: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  errorAction: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  errorActionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inputLabel: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  input: {
    padding: 12,
    borderRadius: 8,
  },
  clearButton: {
    marginLeft: 8,
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 12,
  },
  clearButtonText: {
    fontSize: 12,
  },
  listHeader: {
    flexShrink: 0,
  },
  chipsRow: {
    flexDirection: "row",
    paddingVertical: 12,
    gap: 8,
  },
  repoList: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  fabInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export { styles }
