import { View, Text, StyleSheet } from "react-native"
import { styles } from "./styles"

const Banner = ({ message }: { message: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

export { Banner }
