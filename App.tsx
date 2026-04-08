import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import RepoListScreen from "./src/screens/RepoListScreen"

const client = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={client}>
      <RepoListScreen />
    </QueryClientProvider>
  )
}

export default App
