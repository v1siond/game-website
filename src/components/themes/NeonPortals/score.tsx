'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

// The run's score, kept the way the 1998 time travel platformer keeps it (Warped, named in code only):
// fruit counted one by one, the level's crate count against its total, the crystals taken in the warp
// room, the relics won in time trials, the boss powers, and the mask that floats behind him.
//   fruit     out of the ? crates, the bounce crates and every crate broken
//   crates    the projects' crates broken against the ones on the page (the box counter); all open is the gem
//   crystals  one per level (job) the visitor points at
//   relics    one per band whose time trial ran
//   powers    one per Muay Thai achievement whose boss fell
//   masks     0 to 3; the third makes him invincible for INVINCIBLE_MS, then he drops back to two, as the
//             game does
// Each total is offered by the piece that can score it, so a profession's level only counts its own.
// The provider holds the numbers; the score bar (scoreBar.tsx) shows them and the level end tallies them.

const INVINCIBLE_MS = 8000

type Tally = 'crates' | 'crystals' | 'relics' | 'powers'

export interface Score {
  fruit: number
  masks: number
  invincible: boolean
  counts: Record<Tally, number>
  totals: Record<Tally, number>
}

export interface ScoreApi {
  score: Score
  addFruit: (count: number) => void
  /** A mask from one source (a crate, a boss, a relic) counts once. */
  addMask: (source: string) => void
  offer: (tally: Tally, id: string) => void
  /** Scores an item of a tally once; it answers whether this call was the one that scored it. */
  take: (tally: Tally, id: string) => boolean
  has: (tally: Tally, id: string) => boolean
}

const ScoreContext = createContext<ScoreApi | null>(null)

export function useScore(): ScoreApi {
  const api = useContext(ScoreContext)
  if (!api) throw new Error('useScore is read inside WarpScore')
  return api
}

type Sets = Record<Tally, ReadonlySet<string>>

const EMPTY_SETS = (): Sets => ({ crates: new Set(), crystals: new Set(), relics: new Set(), powers: new Set() })

const withItem = (sets: Sets, tally: Tally, id: string): Sets =>
  sets[tally].has(id) ? sets : { ...sets, [tally]: new Set(sets[tally]).add(id) }

const sizes = (sets: Sets, within?: Sets): Record<Tally, number> => ({
  crates: [...sets.crates].filter((id) => !within || within.crates.has(id)).length,
  crystals: [...sets.crystals].filter((id) => !within || within.crystals.has(id)).length,
  relics: [...sets.relics].filter((id) => !within || within.relics.has(id)).length,
  powers: [...sets.powers].filter((id) => !within || within.powers.has(id)).length,
})

function useMasks() {
  const [sources, setSources] = useState<ReadonlySet<string>>(() => new Set())
  const [invincible, setInvincible] = useState(false)
  const [spent, setSpent] = useState(false)

  const addMask = useCallback((source: string) => {
    setSources((now) => (now.has(source) ? now : new Set(now).add(source)))
  }, [])

  // The third mask: invincible for a while, then back to two masks for good.
  if (sources.size >= 3 && !spent) {
    setSpent(true)
    setInvincible(true)
  }

  useEffect(() => {
    if (!invincible) return
    const timer = window.setTimeout(() => setInvincible(false), INVINCIBLE_MS)
    return () => window.clearTimeout(timer)
  }, [invincible])

  const masks = spent && !invincible ? 2 : Math.min(sources.size, 3)
  return { masks, invincible, addMask }
}

export function WarpScore({ children }: { children: ReactNode }) {
  const [fruit, setFruit] = useState(0)
  const [offered, setOffered] = useState<Sets>(EMPTY_SETS)
  const [taken, setTaken] = useState<Sets>(EMPTY_SETS)
  const { masks, invincible, addMask } = useMasks()

  const addFruit = useCallback((count: number) => setFruit((now) => now + count), [])
  const offer = useCallback((tally: Tally, id: string) => setOffered((now) => withItem(now, tally, id)), [])

  // The ref answers at once, so two takes of one item in the same render still score it once, and
  // take stays one stable function for the pieces that call it from their effects.
  const takenNow = useRef<Sets>(taken)
  const take = useCallback((tally: Tally, id: string) => {
    if (takenNow.current[tally].has(id)) return false
    takenNow.current = withItem(takenNow.current, tally, id)
    setTaken(takenNow.current)
    return true
  }, [])

  const api = useMemo<ScoreApi>(
    () => ({
      score: { fruit, masks, invincible, counts: sizes(taken, offered), totals: sizes(offered) },
      addFruit,
      addMask,
      offer,
      take,
      has: (tally, id) => taken[tally].has(id),
    }),
    [fruit, masks, invincible, taken, offered, addFruit, addMask, offer, take],
  )

  return <ScoreContext.Provider value={api}>{children}</ScoreContext.Provider>
}

/** Every crate of the level is open: the box counter turns into the gem. */
export const allCratesOpen = ({ counts, totals }: Score): boolean => totals.crates > 0 && counts.crates === totals.crates
