import { createNativeStackNavigator } from "@react-navigation/native-stack"
import RepoListScreen from "../screens/RepoListScreen"
import RepoDetailsScreen from "../screens/RepoDetailsScreen"
import { RootStackParamList } from "../types/navigation"

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Repo List" component={RepoListScreen} />
      <Stack.Screen name="Repo Details" component={RepoDetailsScreen} />
    </Stack.Navigator>
  )
}
