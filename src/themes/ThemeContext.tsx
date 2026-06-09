'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Theme, themes, DEFAULT_THEME_ID, getThemeById } from './themes'
import { PreviewProvider } from './PreviewContext'

interface ThemeContextType {
  theme: Theme
  setThemeById: (id: string) => void
  allThemes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Boot into the last-chosen world, defaulting to neon-cyber when nothing is stored.
  const [theme, setTheme] = useState<Theme>(getThemeById(DEFAULT_THEME_ID))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // `?capture=<id>` forces a specific world on load — used by the world-preview
    // screenshot script (scripts/capture-world-previews.mjs). Harmless otherwise.
    const capture = new URLSearchParams(window.location.search).get('capture')
    if (capture && themes.some((t) => t.id === capture)) {
      setTheme(getThemeById(capture))
      return
    }
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setTheme(getThemeById(stored))
  }, [])

  const setThemeById = useCallback((id: string) => {
    const newTheme = getThemeById(id)
    setTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newTheme.id)
    }
  }, [])

  // Render the default until mounted to avoid a hydration mismatch.
  const value: ThemeContextType = {
    theme: mounted ? theme : getThemeById(DEFAULT_THEME_ID),
    setThemeById,
    allThemes: themes,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Forces a specific world's theme into a subtree and marks it as a preview, so the
 * Worlds section cards can render real themed layouts at the right theme without the
 * (now-removed) switcher or blank scroll-gated sections. See PreviewContext.
 */
export function WorldPreviewProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  const value: ThemeContextType = {
    theme,
    setThemeById: () => {},
    allThemes: themes,
  }

  return (
    <ThemeContext.Provider value={value}>
      <PreviewProvider value={true}>{children}</PreviewProvider>
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
