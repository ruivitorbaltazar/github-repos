import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/hooks/useTheme"
import { useLogin } from "./useLogin"
import { styles } from "./styles"

const LoginScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { state, actions } = useLogin()
  const { flow, token, showToken } = state

  const isPATLoading = flow.kind === "submitting" && flow.method === "pat"
  const isAuth0Loading = flow.kind === "submitting" && flow.method === "auth0"
  const isAnyLoading = flow.kind === "submitting"
  const errorMessage = flow.kind === "error" ? flow.message : null

  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{t("login.appTitle")}</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {t("login.subtitle")}
      </Text>

      <TouchableOpacity
        style={[styles.auth0Button, { borderColor: theme.bgTertiary }]}
        onPress={actions.submitAuth0}
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
          onChangeText={actions.setToken}
          placeholder="github_pat_xxxxxxxxxxxx"
          secureTextEntry={!showToken}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, { color: theme.textPrimary }]}
        />
        <TouchableOpacity onPress={actions.toggleShowToken} style={styles.showHideButton}>
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
            {showToken ? t("login.hide") : t("login.show")}
          </Text>
        </TouchableOpacity>
      </View>

      {errorMessage ? (
        <Text style={[styles.error, { color: "#FF3B30" }]}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={actions.submitPAT}
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
