import { useEffect, useState } from "react"

export const useDebounce = (value: string, delay: number = 400): string => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value.toLowerCase()), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
