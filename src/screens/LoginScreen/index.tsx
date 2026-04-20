import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { validateToken } from "@/services/github/auth"
import { styles } from "./styles"

const LoginScreen = () => {
  const { theme } = useTheme()
  const { login } = useAuth()

  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!token.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      await validateToken(token.trim())
      await login(token.trim())
    } catch {
      setError("Invalid token. Please check and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>GitHub Repos</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Enter your Personal Access Token to continue.
      </Text>

      <Text style={[styles.label, { color: theme.textSecondary }]}>Personal Access Token</Text>
      <TextInput
        value={token}
        onChangeText={setToken}
        placeholder="github_pat_xxxxxxxxxxxx"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, { backgroundColor: theme.bgTertiary, color: theme.textPrimary }]}
      />

      {error ? (
        <Text style={[styles.error, { color: "#FF3B30" }]}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isLoading || !token.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default LoginScreen
