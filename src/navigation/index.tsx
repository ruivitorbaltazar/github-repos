import { useColorScheme } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { HeaderBackButton } from '@react-navigation/elements'

import RepoListScreen from "@/screens/RepoListScreen"
import RepoDetailsScreen from "@/screens/RepoDetailsScreen"
import { RootStackParamList } from "@/types/navigation"

const Stack = createNativeStackNavigator<RootStackParamList>()

const sharedOptionsLight = {
  headerStyle: {
    backgroundColor: "#fff",
  },
  headerTintColor: "#333",
}

const sharedOptionsDark = {
  ...sharedOptionsLight,
  headerStyle: {
    backgroundColor: "#333",
  },
  headerTintColor: "#fff",
}

export default function Navigation() {

  const colorScheme = useColorScheme()
  const sharedOptions = colorScheme === "dark" ? sharedOptionsDark : sharedOptionsLight

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RepoList"
        component={RepoListScreen}
        options={{ ...sharedOptions, title: "Repositories" }}
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
    </Stack.Navigator>
  )
}
