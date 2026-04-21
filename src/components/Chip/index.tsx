import { Text, TouchableOpacity } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { styles } from "./styles"

type ChipProps = {
  label: string
  isSelected: boolean
  onPress: () => void
}

const Chip = ({ label, isSelected, onPress }: ChipProps) => {
  const { theme } = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: isSelected ? theme.textPrimary : theme.bgTertiary },
        isSelected && { backgroundColor: theme.textPrimary },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: isSelected ? theme.bgPrimary : theme.textSecondary },
          isSelected && styles.chipTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export { Chip }
