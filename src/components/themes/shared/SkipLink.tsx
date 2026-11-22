'use client'

import { useLabels } from '@/components/cv/CVDataProvider'

// The first stop of a Tab from the top of a world: it jumps past the hero and the menus to the main
// element each world root marks as main-content. The skip-link class (globals.css) keeps it off screen
// until it has focus; a world that draws its focused link in its own look passes that class instead.
export function SkipLink({ className = 'skip-link' }: { className?: string }) {
  const { navigation } = useLabels()
  return (
    <a href="#main-content" className={className}>
      {navigation.skipToContent}
    </a>
  )
}
