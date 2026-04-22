import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { validateToken } from "@/services/github/auth"
import { styles } from "./styles"

const LoginScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { login, loginViaAuth0 } = useAuth()

  const [token, setToken] = useState("")
  const [isPATLoading, setIsPATLoading] = useState(false)
  const [isAuth0Loading, setIsAuth0Loading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showToken, setShowToken] = useState(false)

  const handlePATLogin = async () => {
    if (!token.trim()) return
    setIsPATLoading(true)
    setError(null)
    try {
      await validateToken(token.trim())
      await login(token.trim())
    } catch {
      setError(t("login.invalidToken"))
    } finally {
      setIsPATLoading(false)
    }
  }

  const handleAuth0Login = async () => {
    setIsAuth0Loading(true)
    setError(null)
    try {
      await loginViaAuth0()
    } catch (e) {
      const message = e instanceof Error ? e.message : t("login.auth0Failed")
      setError(message)
    } finally {
      setIsAuth0Loading(false)
    }
  }

  const isAnyLoading = isPATLoading || isAuth0Loading

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{t("login.appTitle")}</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {t("login.subtitle")}
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
            {t("login.signInWithAuth0")}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: theme.bgTertiary }]} />
        <Text style={[styles.dividerText, { color: theme.textTertiary }]}>{t("login.or")}</Text>
        <View style={[styles.dividerLine, { backgroundColor: theme.bgTertiary }]} />
      </View>

      <Text style={[styles.label, { color: theme.textSecondary }]}>{t("login.patLabel")}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: theme.bgTertiary }]}>
        <TextInput
          value={token}
          onChangeText={setToken}
          placeholder={t("login.patPlaceholder")}
          secureTextEntry={!showToken}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, { color: theme.textPrimary }]}
        />
        <TouchableOpacity onPress={() => setShowToken(v => !v)} style={styles.showHideButton}>
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
            {showToken ? t("login.hide") : t("login.show")}
          </Text>
        </TouchableOpacity>
      </View>

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
          <Text style={styles.buttonText}>{t("login.signIn")}</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default LoginScreen
