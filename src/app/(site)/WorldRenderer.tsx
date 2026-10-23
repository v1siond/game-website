'use client'

import { useTheme } from '@/themes/ThemeContext'
import { getWorldComponent } from '@/themes/worlds'
import { DEFAULT_THEME_ID } from '@/themes/themes'

// Boots straight into the current world (DEFAULT_THEME_ID, medieval-fantasy, when nothing is stored).
// The server renders the default, so a fresh visitor gets it on the first paint.
export function WorldRenderer() {
  const { theme } = useTheme()
  const WorldComponent = getWorldComponent(theme.id) ?? getWorldComponent(DEFAULT_THEME_ID)!

  return <WorldComponent />
}
