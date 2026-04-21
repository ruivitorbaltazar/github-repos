import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/contexts/ThemeProvider"
import { AuthProvider } from "@/contexts/AuthProvider"
import Navigation from "@/navigation"

const client = new QueryClient()

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={client}>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
