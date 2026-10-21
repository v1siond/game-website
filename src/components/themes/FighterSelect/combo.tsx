'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ImpactBurst } from './badges'
import look from './world.module.css'
import fight from './fight.module.css'

// The combo counter over the projects. Every card the pointer lands on is a hit: the card freezes and
// vibrates for the hitstop, a burst flashes where the pointer entered, and the counter on player one's
// side climbs. A pause longer than COMBO_WINDOW_MS drops the combo, like the defender recovering; the
// counter stops at MAX_HITS, as the arcade counters did. React renders only on a hit: the burst's
// position goes to CSS variables on the card, the burst itself is a keyed one shot animation.

const COMBO_WINDOW_MS = 1400
const MAX_HITS = 99

const ComboContext = createContext<() => void>(() => {})

function ComboCounter({ hits }: { hits: number }) {
  const { hud } = useLabels()

  return (
    <span key={hits} className={`ml-2 mt-2 inline-flex items-baseline gap-1 bg-[color:var(--fs-ink)] px-3 py-1 ${look.display} ${fight.comboPop}`}>
      <span className={`text-4xl ${look.roundCall}`}>{hits}</span>
      <span className="text-sm uppercase text-[color:var(--fs-chrome)]">{hud.hits}</span>
    </span>
  )
}

export function ComboZone({ children }: { children: ReactNode }) {
  const [hits, setHits] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const land = useCallback(() => {
    setHits((count) => Math.min(count + 1, MAX_HITS))
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHits(0), COMBO_WINDOW_MS)
  }, [])

  return (
    <ComboContext.Provider value={land}>
      <div className="relative">
        <div className="pointer-events-none sticky top-4 z-30 flex h-0 justify-start" aria-hidden="true">
          {hits > 1 && <ComboCounter hits={hits} />}
        </div>
        {children}
      </div>
    </ComboContext.Provider>
  )
}

export function HitCard({ children }: { children: ReactNode }) {
  const land = useContext(ComboContext)
  const [hit, setHit] = useState(0)

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--hx', `${event.clientX - box.left}px`)
    event.currentTarget.style.setProperty('--hy', `${event.clientY - box.top}px`)
    setHit((count) => count + 1)
    land()
  }

  return (
    <div onPointerEnter={onPointerEnter} className="relative">
      <div key={hit} className={hit > 0 ? fight.hitShake : ''}>
        {children}
      </div>
      {hit > 0 && (
        <span key={hit} className={`pointer-events-none absolute left-[var(--hx)] top-[var(--hy)] z-10 ${fight.spark}`} aria-hidden="true">
          <ImpactBurst className="h-20 w-20" />
        </span>
      )}
    </div>
  )
}
