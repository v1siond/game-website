'use client'

import { useTheme } from '@/themes/ThemeContext'
import { getWorldComponent } from '@/themes/worlds'

export default function Home() {
  const { theme } = useTheme()

  // Boot straight into the current world (neon-cyber by default). Each themed layout owns
  // its own in-theme "Enter another world" section (see <WorldsGrid/>), so there's nothing
  // to append here.
  const WorldComponent = getWorldComponent(theme.id) ?? getWorldComponent('neon-cyber')!

  return <WorldComponent />
}
