'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { CrateArt } from './crateArt'
import { Crystal, Fruit, Gem, MaskFace, Relic } from './pickups'
import { allCratesOpen, useScore, type Score } from './score'
import ui from './warped.module.css'

// The score bar the way the time travel platformer shows it (Warped, named in code only): nothing on
// screen while nothing changes, then the counter that moved drops in from the top, its icon spins, and
// it slides away again after SHOW_MS. The fruit sits top left with its number, the masks beside it, and
// the box counter, the crystals, the relics and the powers on the right, each with its count against its
// total (a number always rides with the icon, so the state never rests on colour alone). The bar is one
// polite live region, so a screen reader hears each new count once.

const SHOW_MS = 2600

type Counter = 'fruit' | 'masks' | 'crates' | 'crystals' | 'relics' | 'powers'

const ORDER: Counter[] = ['fruit', 'masks', 'crates', 'crystals', 'relics', 'powers']

const valueOf = (score: Score, counter: Counter): number => {
  if (counter === 'fruit') return score.fruit
  if (counter === 'masks') return score.masks
  return score.counts[counter]
}

/** The first counter whose value moved between two scores. */
const changedCounter = (before: Score, after: Score): Counter | null =>
  ORDER.find((counter) => valueOf(before, counter) !== valueOf(after, counter)) ?? null

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

function Slot({ shown, icon, children, spoken }: { shown: boolean; icon: ReactNode; children: ReactNode; spoken: string }) {
  return (
    <p className={`${ui.counter} ${shown ? ui.shown : ''}`}>
      <span className={`block h-9 w-9 ${shown ? ui.counterSpin : ''}`} aria-hidden="true">
        {icon}
      </span>
      <span className={ui.digits} aria-hidden="true">
        {children}
      </span>
      <span className="sr-only">{spoken}</span>
    </p>
  )
}

export function ScoreBar() {
  const { hud, warp } = useLabels()
  const { score } = useScore()
  const shown = useShownCounter(score)
  const { counts, totals } = score
  const gem = allCratesOpen(score)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-wrap justify-between gap-3 px-4 pt-3 sm:px-6" aria-live="polite">
      <div className="flex gap-3">
        <Slot shown={shown === 'fruit'} icon={<Fruit className="h-full w-full" />} spoken={fillLabel(warp.fruitCount, { count: score.fruit })}>
          {score.fruit}
        </Slot>
        <Slot
          shown={shown === 'masks'}
          icon={<MaskFace className="h-full w-full" gold={score.invincible} feathers={score.masks > 1 ? 4 : 2} />}
          spoken={score.invincible ? warp.invincible : fillLabel(warp.maskScore, { count: score.masks })}
        >
          {score.masks}/3
        </Slot>
      </div>
      <div className="mr-12 flex flex-wrap justify-end gap-3 sm:mr-28">
        <Slot
          shown={shown === 'crates'}
          icon={gem ? <Gem className={`h-full w-full ${ui.award}`} /> : <CrateArt kind="wood" className="h-full w-full" />}
          spoken={`${fillLabel(hud.crateScore, { count: counts.crates, total: totals.crates })}${gem ? ` ${hud.gemAwarded}` : ''}`}
        >
          {counts.crates}/{totals.crates}
        </Slot>
        <Slot shown={shown === 'crystals'} icon={<Crystal className="h-full w-full" />} spoken={fillLabel(warp.crystalScore, { count: counts.crystals, total: totals.crystals })}>
          {counts.crystals}/{totals.crystals}
        </Slot>
        <Slot shown={shown === 'relics'} icon={<Relic className="h-full w-full" />} spoken={fillLabel(warp.relicScore, { count: counts.relics, total: totals.relics })}>
          {counts.relics}/{totals.relics}
        </Slot>
        <Slot shown={shown === 'powers'} icon={<Gem tone="violet" className="h-full w-full" />} spoken={fillLabel(warp.powerScore, { count: counts.powers, total: totals.powers })}>
          {counts.powers}/{totals.powers}
        </Slot>
      </div>
    </div>
  )
}

/**
 * The mask that floats behind him, grown by the masks taken: one shows a small mask with two feathers
 * over his shoulder, two the full fan of four, and the third covers his face in gold while he is
 * invincible. Nothing shows before the first mask.
 */
export function MaskCompanion({ className = '' }: { className?: string }) {
  const { score } = useScore()
  if (score.masks === 0) return null

  const place = score.invincible ? 'left-[22%] top-[-4%] h-[44%] w-[56%] z-10' : 'left-[-30%] top-[4%] h-[34%] w-[30%]'

  return (
    <span className={`pointer-events-none absolute ${place} ${className}`} aria-hidden="true">
      <span className={`block h-full w-full ${ui.maskBob}`}>
        <MaskFace className="h-full w-full" feathers={score.masks > 1 || score.invincible ? 4 : 2} gold={score.invincible} />
      </span>
    </span>
  )
}
