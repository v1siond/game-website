'use client'

import type { ReactNode } from 'react'
import { useScrollScene, type ScrollSceneOptions } from '@/hooks/useScrollScene'

// A section whose scene follows scroll. The hook writes `--scene-progress` (0 to 1) on this element;
// children read it in their own transform and opacity classes (a Tailwind arbitrary value over
// `var(--scene-progress,0)`), so a frame never re-renders React.
//
// `relative z-20`: the reveal's transform makes this element a stacking context, which would trap the
// inner sections' z-20 as a local value and let a world's fixed background layers paint over the
// content. A positive z-index on the wrapper itself keeps the whole block above them.

// Default reveal: fades in and rises 2rem as the scene plays. Transform and opacity only.
const REVEAL_CLASSES =
  'opacity-[var(--scene-progress,0)] translate-y-[calc((1_-_var(--scene-progress,0))*2rem)]'

interface ScrollSceneProps extends ScrollSceneOptions {
  children: ReactNode
  className?: string
  reveal?: boolean
}

export function ScrollScene({ children, className = '', reveal = true, ...options }: ScrollSceneProps) {
  const { ref, phase } = useScrollScene<HTMLDivElement>(options)

  return (
    <div ref={ref} data-scene-phase={phase} className={`relative z-20 ${reveal ? REVEAL_CLASSES : ''} ${className}`}>
      {children}
    </div>
  )
}
