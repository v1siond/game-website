'use client'

import { useTheme } from '@/themes/ThemeContext'
import { getWorldComponent } from '@/themes/worlds'

// Boots straight into the current world (neon-cyber by default). Each world owns its own in-theme
// "Enter another world" section, so nothing is appended here.
export function WorldRenderer() {
  const { theme } = useTheme()
  const WorldComponent = getWorldComponent(theme.id) ?? getWorldComponent('neon-cyber')!

  return <WorldComponent />
}
