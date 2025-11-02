import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContext.jsx'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    return saved === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : undefined
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // ignore
    }
  }, [theme])

  const value = useMemo(() => ({
    theme,
    toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}