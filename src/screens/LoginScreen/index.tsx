import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { validateToken } from "@/services/github/auth"
import { styles } from "./styles"

const LoginScreen = () => {
  const { theme } = useTheme()
  const { login, loginViaAuth0 } = useAuth()

  const [token, setToken] = useState("")
  const [isPATLoading, setIsPATLoading] = useState(false)
  const [isAuth0Loading, setIsAuth0Loading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePATLogin = async () => {
    if (!token.trim()) return
    setIsPATLoading(true)
    setError(null)
    try {
      await validateToken(token.trim())
      await login(token.trim())
    } catch {
      setError("Invalid token. Please check and try again.")
    } finally {
      setIsPATLoading(false)
    }
  }

  const handleAuth0Login = async () => {
    setIsAuth0Loading(true)
    setError(null)
    try {
      await loginViaAuth0()
    } catch {
      setError("Auth0 login failed. Please try again.")
    } finally {
      setIsAuth0Loading(false)
    }
  }

  const isAnyLoading = isPATLoading || isAuth0Loading

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>GitHub Repos</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Sign in to continue.
      </Text>

      <TouchableOpacity
        style={[styles.auth0Button, { borderColor: theme.bgTertiary }]}
        onPress={handleAuth0Login}
        disabled={isAnyLoading}
      >
        {isAuth0Loading ? (
          <ActivityIndicator color={theme.textPrimary} />
        ) : (
          <Text style={[styles.auth0ButtonText, { color: theme.textPrimary }]}>
            Sign in with Auth0
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: theme.bgTertiary }]} />
        <Text style={[styles.dividerText, { color: theme.textTertiary }]}>or</Text>
        <View style={[styles.dividerLine, { backgroundColor: theme.bgTertiary }]} />
      </View>

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
        onPress={handlePATLogin}
        disabled={isAnyLoading || !token.trim()}
      >
        {isPATLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default LoginScreen
