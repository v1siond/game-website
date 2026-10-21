'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { HeroCharacter } from './character'
import look from './jungle.module.css'
import quake from './slap.module.css'

// The tech stack shaken loose by the ground slap, the source's hand slap that pounds the floor and
// knocks everything near it. He stands over the boards; when the level scrolls in he slaps the ground
// left, right, left, right, dust puffing from each hand, the ground shudders and the boards jolt up
// one after another and drop back. Slap again does it once more.
//
// Pattern: a slap count remounts the boards (the jolt replays) and a timer ends the slapping pose.

const SLAP_MS = 1800

export function GroundSlap({ children }: { children: ReactNode }) {
  const { jungle } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.15 })
  const [slaps, setSlaps] = useState(0)
  const [slapping, setSlapping] = useState(false)
  const timer = useRef(0)
  const started = useRef(false)

  const slap = useCallback(() => {
    setSlaps((count) => count + 1)
    if (prefersReducedMotion()) return
    setSlapping(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSlapping(false), SLAP_MS)
  }, [])

  // The first slap plays once, on arrival; a later one comes from the button.
  useEffect(() => {
    if (!triggered || started.current) return
    started.current = true
    slap()
  }, [triggered, slap])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <div ref={ref} className={quake.field} data-slapping={slapping || undefined}>
      <div className="relative mx-auto mb-4 h-28 w-20 sm:h-32 sm:w-24" aria-hidden="true">
        <HeroCharacter profession="engineer" pose={slapping ? 'slap' : 'idle'} className="h-full w-full" />
        <span className={`absolute bottom-0 left-0 block h-4 w-8 rounded-full ${quake.dust}`} />
        <span className={`absolute bottom-0 right-0 block h-4 w-8 rounded-full ${quake.dust} ${quake.dustLate}`} />
      </div>
      <div key={slaps} className={slaps > 0 ? quake.shaken : undefined}>
        {children}
      </div>
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={slap} className={`min-h-[44px] rounded-xl px-5 text-base ${look.button} ${look.buttonWood} ${look.focus}`}>
          {jungle.slapAgain}
        </button>
      </div>
    </div>
  )
}
