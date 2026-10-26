'use client'

import { useTheme } from '@/themes/ThemeContext'
import { getWorldComponent } from '@/themes/worlds'
import { DEFAULT_THEME_ID } from '@/themes/themes'

// Boots straight into the current world (DEFAULT_THEME_ID, retro-atomic, when nothing is stored).
// The server renders the default, so a fresh visitor gets it on the first paint. The root carries
// data-world-root so a pending stored world can hide the default until it replaces it (worldPending.ts).
export function WorldRenderer() {
  const { theme } = useTheme()
  const WorldComponent = getWorldComponent(theme.id) ?? getWorldComponent(DEFAULT_THEME_ID)!

  return (
    <div data-world-root className="contents">
      <WorldComponent />
    </div>
  )
}
