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

  const resolvedMode = useMemo(() => (
    mode === "system" ? systemScheme : mode
  ), [mode, systemScheme])

  const resolvedTheme = useMemo(() => (
    resolvedMode === "dark" ? darkTheme : lightTheme
  ), [mode, systemScheme])

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        mode,
        setMode,
        resolvedMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProvider }
