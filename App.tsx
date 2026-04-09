import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/contexts/ThemeProvider"
import Navigation from "@/navigation"

const client = new QueryClient()

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
