'use client'

import { useEffect, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { Knight } from './knight'
import { usePoseScript } from './poses'
import { SOUL } from './palette'
import souls from './souls.module.css'

// About is behind a fog gate, the white wall the game puts at the way into a new area. When the visitor
// reaches it he walks out of the fog under the stone arch (two heavy strides, 2.4 s), the wall thins
// behind him and the fog lying over the panel clears, so the words are what he walked in to. Once
// through he stands at the panel's edge, breathing. Under reduced motion he already stands through the
// gate and the fog is gone.

const STRIDES_MS = 2400

function Arch() {
  return (
    <svg viewBox="0 0 80 112" className="absolute bottom-0 left-0 h-28 w-20" aria-hidden="true" focusable="false">
      <path d="M6 112 V40 Q40 0 74 40 V112 H62 V44 Q40 16 18 44 V112 Z" fill={SOUL.ridge} />
      <path d="M6 112 V40 Q40 0 74 40" fill="none" stroke={SOUL.stoneLight} strokeWidth={1.2} opacity={0.6} />
      <path d="M18 112 V44 Q40 16 62 44 V112 Z" fill={SOUL.abyss} />
    </svg>
  )
}

export function FogGate({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.35 })
  const script = usePoseScript('idle')
  const { play } = script
  const through = triggered || reduced

  useEffect(() => {
    if (!triggered || reduced) return
    play([{ pose: 'walk', ms: STRIDES_MS }])
  }, [triggered, reduced, play])

  return (
    <div ref={ref}>
      <div className="relative h-28 overflow-hidden">
        <Arch />
        <div className={`absolute bottom-0 left-4 h-24 w-[3.75rem] ${through ? souls.gateThrough : ''}`}>
          <Knight key={script.key} gear="knight" pose={script.pose} className="h-full w-full" />
        </div>
        <span className={`absolute bottom-0 left-[1.1rem] h-24 w-[2.75rem] ${souls.gateWall} ${through ? souls.gateWallThin : ''}`} aria-hidden="true" />
      </div>
      <div className="relative">
        {children}
        <span className={`pointer-events-none absolute inset-0 ${souls.gateMist} ${through ? souls.gateMistGone : ''}`} aria-hidden="true" />
      </div>
    </div>
  )
}
