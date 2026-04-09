import { createContext } from "react"
import { ThemeMode } from "@/types/theme"
import { lightTheme } from "@/themes"

type ThemeContextType = {
  theme: typeof lightTheme
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  resolvedMode: "light" | "dark" | null | undefined
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export { ThemeContext }
