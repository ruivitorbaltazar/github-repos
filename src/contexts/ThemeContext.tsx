import { createContext } from "react"
import { ThemeMode } from "@/types/theme"
import { lightTheme } from "@/themes"

type ThemeContextType = {
  theme: typeof lightTheme
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export { ThemeContext }
