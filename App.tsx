import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Navigation from "@/navigation"

const client = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={client}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </QueryClientProvider>
  )
}

export default App
