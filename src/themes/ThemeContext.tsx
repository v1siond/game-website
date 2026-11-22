'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { Theme, themes, DEFAULT_THEME_ID, THEME_STORAGE_KEY, getThemeById } from './themes'
import { PreviewProvider } from './PreviewContext'
import { WORLD_PENDING_ATTR } from './worldPending'
import { readStored, writeStored } from '@/lib/storage'
import { captureWorld } from '@/lib/worlds/capture'

interface ThemeContextType {
  theme: Theme
  setThemeById: (id: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Boot into the last-chosen world, defaulting to DEFAULT_THEME_ID (adventure-paths) when nothing is stored.
  const [theme, setTheme] = useState<Theme>(getThemeById(DEFAULT_THEME_ID))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // `?capture=<id>` forces a specific world on load (lib/worlds/capture.ts). Harmless otherwise.
    const capture = captureWorld(window.location.search)
    if (capture && themes.some((t) => t.id === capture)) {
      setTheme(getThemeById(capture))
      return
    }
    const stored = readStored('local', THEME_STORAGE_KEY)
    if (stored) setTheme(getThemeById(stored))
  }, [])

  // Runs after the commit that rendered the picked world, so the hidden default is never shown.
  useEffect(() => {
    if (mounted) document.documentElement.removeAttribute(WORLD_PENDING_ATTR)
  }, [mounted, theme])

  const setThemeById = useCallback((id: string) => {
    const newTheme = getThemeById(id)
    setTheme(newTheme)
    writeStored('local', THEME_STORAGE_KEY, newTheme.id)
  }, [])

  // Render the default until mounted to avoid a hydration mismatch.
  const value = useMemo<ThemeContextType>(
    () => ({ theme: mounted ? theme : getThemeById(DEFAULT_THEME_ID), setThemeById }),
    [mounted, theme, setThemeById],
  )

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
