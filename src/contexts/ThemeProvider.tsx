import React, { useMemo, useState } from "react"
import { useColorScheme } from "react-native"
import { ThemeMode } from "@/types/theme"
import { lightTheme, darkTheme } from "@/themes"

import { ThemeContext } from "@/contexts/ThemeContext"

const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const systemScheme = useColorScheme()
  const [mode, setMode] = useState<ThemeMode>("system")

  const resolvedTheme = useMemo(() => {
    if (mode === "system") {
      return systemScheme === "dark" ? darkTheme : lightTheme
    }
    // If mode is explicitly set to "light" or "dark", use that
    return mode === "dark" ? darkTheme : lightTheme
  }, [mode, systemScheme])

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        mode,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProvider }
