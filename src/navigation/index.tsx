import { TouchableOpacity, Text } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import RepoListScreen from "@/screens/RepoListScreen"
import RepoDetailsScreen from "@/screens/RepoDetailsScreen"
import LoginScreen from "@/screens/LoginScreen"

import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"

import { RootStackParamList } from "@/types/navigation"

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Navigation() {
  const { theme, resolvedMode, setMode } = useTheme()
  const { token, logout } = useAuth()

  const sharedOptions = {
    headerStyle: {
      backgroundColor: theme.bgPrimary,
    },
    headerTintColor: theme.textPrimary,
    headerRight: () => (
      <TouchableOpacity
        onPress={() => setMode(resolvedMode === "light" ? "dark" : "light")}
        style={{ alignItems: "center", justifyContent: "center", width: 40, height: 40 }}
      >
        <Text style={{ fontSize: 20, color: theme.textPrimary }}>
          {resolvedMode === "light" ? "☼" : "☾"}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <Stack.Navigator>
      {token == null ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ ...sharedOptions, title: "Sign in", animationTypeForReplace: "pop" }}
        />
      ) : (
        <>
          <Stack.Screen
            name="RepoList"
            component={RepoListScreen}
            options={{
              ...sharedOptions,
              title: "Repositories",
              headerLeft: () => (
                <TouchableOpacity onPress={logout} style={{ alignItems: "center", justifyContent: "center", height: 40, paddingHorizontal: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: theme.textSecondary }}>Sign out</Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="RepoDetails"
            component={RepoDetailsScreen}
            options={(({ route }: { route: { params: { repo: { name: string } } } }) => (
              {
                ...sharedOptions,
                title: route.params.repo.name
              }
            ))}
          />
        </>
      )}
    </Stack.Navigator>
  )
}
