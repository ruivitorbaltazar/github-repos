import { SafeAreaProvider } from "react-native-safe-area-context"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import RepoListScreen from "./src/screens/RepoListScreen"

const client = new QueryClient()

const App = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={client}>
        <RepoListScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

export default App
