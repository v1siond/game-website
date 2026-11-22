'use client'

import type { ReactNode } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import stage from './stage.module.css'

/**
 * A scene outside the section stages (the profession switch, his set, an art break, the map run) that waits
 * on its first frame until it is in view, the way a cued IsleStage does (stage.module.css .cue).
 */
export function Cue({ children }: { children: ReactNode }) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  return (
    <div ref={ref} data-on={triggered || undefined} className={stage.cue}>
      {children}
    </div>
  )
}
