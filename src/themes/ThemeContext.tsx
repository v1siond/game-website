'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Theme, themes, DEFAULT_THEME_ID, getThemeById } from './themes'

interface ThemeContextType {
  theme: Theme
  setThemeById: (id: string) => void
  allThemes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getThemeById(DEFAULT_THEME_ID))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const foundTheme = getThemeById(stored)
      setTheme(foundTheme)
    }
  }, [])

  const setThemeById = (id: string) => {
    const newTheme = getThemeById(id)
    setTheme(newTheme)
    localStorage.setItem(STORAGE_KEY, id)
  }

  // Prevent hydration mismatch by rendering default until mounted
  const value: ThemeContextType = {
    theme: mounted ? theme : getThemeById(DEFAULT_THEME_ID),
    setThemeById,
    allThemes: themes,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
