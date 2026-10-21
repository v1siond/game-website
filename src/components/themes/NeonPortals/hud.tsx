'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { Crate, Fruit, Gem } from './art'
import world from './world.module.css'

// The world's score, the way the platformer it draws on keeps it: nothing on screen while nothing
// changes, then the counter that changed drops in from the top, ticks, and slides away again.
//   fruit   one per job highlight, collected by pointing at (or focusing, or tapping) a level card
//   crates  one per project, broken open by a click or the spin
//   gem     awarded once every crate on the page is open
// The counts live in this provider so the cards that score and the bar that shows the score stay apart;
// the bar is one polite live region, so a screen reader hears the new count once.

const SHOW_MS = 2600

interface Score {
  fruit: number
  fruitTotal: number
  crates: number
  crateTotal: number
}

interface HudApi {
  score: Score
  /** A level card offers its fruit once; it returns false when they were already taken. */
  collectFruit: (id: string, count: number) => boolean
  hasCollected: (id: string) => boolean
  offerFruit: (id: string, count: number) => void
  breakCrate: (id: string) => void
  offerCrate: (id: string) => void
  isBroken: (id: string) => boolean
}

const HudContext = createContext<HudApi | null>(null)

export function useHud(): HudApi {
  const hud = useContext(HudContext)
  if (!hud) throw new Error('useHud is read inside WarpHud')
  return hud
}

export function WarpHud({ children }: { children: ReactNode }) {
  const [fruitTaken, setFruitTaken] = useState<Record<string, number>>({})
  const [fruitOffered, setFruitOffered] = useState<Record<string, number>>({})
  const [broken, setBroken] = useState<Set<string>>(() => new Set())
  const [offered, setOffered] = useState<Set<string>>(() => new Set())

  const offerFruit = useCallback((id: string, count: number) => {
    setFruitOffered((now) => (now[id] === count ? now : { ...now, [id]: count }))
  }, [])

  const collectFruit = useCallback(
    (id: string, count: number) => {
      if (id in fruitTaken) return false
      setFruitTaken((now) => ({ ...now, [id]: count }))
      return true
    },
    [fruitTaken],
  )

  const offerCrate = useCallback((id: string) => {
    setOffered((now) => (now.has(id) ? now : new Set(now).add(id)))
  }, [])

  const breakCrate = useCallback((id: string) => {
    setBroken((now) => (now.has(id) ? now : new Set(now).add(id)))
  }, [])

  const api = useMemo<HudApi>(() => {
    const sum = (counts: Record<string, number>) => Object.values(counts).reduce((total, count) => total + count, 0)
    return {
      score: {
        fruit: sum(fruitTaken),
        fruitTotal: sum(fruitOffered),
        crates: [...broken].filter((id) => offered.has(id)).length,
        crateTotal: offered.size,
      },
      collectFruit,
      hasCollected: (id) => id in fruitTaken,
      offerFruit,
      breakCrate,
      offerCrate,
      isBroken: (id) => broken.has(id),
    }
  }, [fruitTaken, fruitOffered, broken, offered, collectFruit, offerFruit, breakCrate, offerCrate])

  return (
    <HudContext.Provider value={api}>
      {children}
      <HudBar score={api.score} />
    </HudContext.Provider>
  )
}

type Counter = 'fruit' | 'crates'

/** Which counter changed last, held on screen for SHOW_MS after each change, then put away. */
/** Which counter a score change moved; the fruit wins when both moved in one render. */
function changedCounter(before: Score, after: Score): Counter | null {
  if (after.fruit !== before.fruit) return 'fruit'
  if (after.crates !== before.crates) return 'crates'
  return null
}

function useShownCounter(score: Score): Counter | null {
  const [shown, setShown] = useState<Counter | null>(null)
  const last = useRef(score)

  useEffect(() => {
    const before = last.current
    last.current = score
    const changed = changedCounter(before, score)
    if (!changed) return
    setShown(changed)
    const timer = window.setTimeout(() => setShown(null), SHOW_MS)
    return () => window.clearTimeout(timer)
  }, [score])

  return shown
}

function HudBar({ score }: { score: Score }) {
  const { hud } = useLabels()
  const shown = useShownCounter(score)
  const allOpen = score.crateTotal > 0 && score.crates === score.crateTotal

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center gap-4 px-4 pt-3 sm:justify-end sm:pr-6" aria-live="polite">
      <p className={`${world.hudCounter} ${shown === 'fruit' ? world.hudShown : ''}`}>
        <Fruit className={`h-9 w-9 ${shown === 'fruit' ? world.hudSpin : ''}`} />
        <span className={world.hudDigits}>{score.fruit}</span>
        <span className="sr-only">{fillLabel(hud.fruitScore, { count: score.fruit, total: score.fruitTotal })}</span>
      </p>
      <p className={`${world.hudCounter} ${shown === 'crates' ? world.hudShown : ''}`}>
        <Crate className="h-9 w-9" />
        <span className={world.hudDigits}>
          {score.crates}/{score.crateTotal}
        </span>
        {allOpen && <Gem className={`h-9 w-7 ${world.gemAward}`} />}
        <span className="sr-only">
          {fillLabel(hud.crateScore, { count: score.crates, total: score.crateTotal })}
          {allOpen && ` ${hud.gemAwarded}`}
        </span>
      </p>
    </div>
  )
}
