'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import { Bandicoot } from './bandicoot'
import { CVLink, HeroActions } from './buttons'
import { CrateArt } from './crateArt'
import { Crystal, Fruit, Gem, MaskFace, Relic } from './pickups'
import { MaskCompanion } from './scoreBar'
import { allCratesOpen, useScore, type Score } from './score'
import end from './levelEnd.module.css'
import ui from './warped.module.css'

// Contact as the end of a level (the time travel platformer, Warped, named in code only): the exit
// warp pad, him dancing on it, and the level's tally beside him, every count of the visit ticking up in
// turn the way the game counts the boxes before it hands over the gem: the fruit, the crates against
// their total, the crystals, the relics, the powers and the masks. Every crate open shows the gem.
// Clicking him (or Dance again) plays the dance once more. Then the contact actions and the CV.
// Plays once when the section scrolls in (useSectionTrigger); reduced motion shows the totals at once.

const TICKS = 12
const TICK_MS = 50

interface Row {
  key: string
  name: string
  icon: ReactNode
  count: number
  total: number | null
}

/** Counts up from 0 to the target once the section is on, a step per tick. */
function useTicker(target: number, on: boolean) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!on || step >= TICKS) return
    if (prefersReducedMotion()) {
      setStep(TICKS)
      return
    }
    const timer = window.setTimeout(() => setStep((now) => now + 1), TICK_MS)
    return () => window.clearTimeout(timer)
  }, [on, step])

  return Math.round((target * step) / TICKS)
}

function rowsOf(score: Score, words: Labels['warp']): Row[] {
  const { counts, totals } = score
  const rows: Row[] = [
    { key: 'fruit', name: words.tallyFruit, icon: <Fruit className="h-full w-full" />, count: score.fruit, total: null },
    { key: 'crates', name: words.tallyCrates, icon: <CrateArt kind="wood" className="h-full w-full" />, count: counts.crates, total: totals.crates },
    { key: 'crystals', name: words.tallyCrystals, icon: <Crystal className="h-full w-full" />, count: counts.crystals, total: totals.crystals },
    { key: 'relics', name: words.tallyRelics, icon: <Relic className="h-full w-full" />, count: counts.relics, total: totals.relics },
    { key: 'powers', name: words.tallyPowers, icon: <Gem tone="violet" className="h-full w-full" />, count: counts.powers, total: totals.powers },
    { key: 'masks', name: words.tallyMasks, icon: <MaskFace className="h-full w-full" />, count: score.masks, total: 3 },
  ]
  return rows.filter((row) => row.total !== 0)
}

function TallyRow({ row, index, on }: { row: Row; index: number; on: boolean }) {
  const { warp } = useLabels()
  const shown = useTicker(row.count, on)
  const spoken = row.total === null ? fillLabel(warp.fruitCount, { count: row.count }) : fillLabel(warp.tallyLine, { name: row.name, count: row.count, total: row.total })

  return (
    <li className={`flex items-center gap-3 ${ui.rise}`} style={{ '--i': index } as CSSProperties}>
      <span className="block h-9 w-9 shrink-0" aria-hidden="true">
        {row.icon}
      </span>
      <span className="flex-1 text-base font-bold text-[color:var(--np-white)]" aria-hidden="true">
        {row.name}
      </span>
      <span className={`text-2xl tabular-nums text-[color:var(--np-gold)] ${ui.chunk}`} aria-hidden="true">
        {row.total === null ? shown : `${shown}/${row.total}`}
      </span>
      <span className="sr-only">{spoken}</span>
    </li>
  )
}

export function LevelEnd({ profession }: { profession: Profession }) {
  const { sections, warp, hud } = useLabels()
  const { score } = useScore()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })
  const [encore, setEncore] = useState(0)
  const gem = allCratesOpen(score)
  const rows = rowsOf(score, warp)

  return (
    <section id="contact" ref={ref} data-on={triggered || undefined} aria-labelledby="np-contact" className={`relative z-20 scroll-mt-20 px-4 py-16 sm:px-6 ${ui.stage}`}>
      <div className={`mx-auto grid max-w-5xl items-start gap-8 p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:p-10 ${ui.panel}`}>
        <div>
          <p className={`text-center text-2xl ${ui.display}`}>{warp.levelComplete}</p>
          <div className="relative mx-auto mt-4 h-56 w-40">
            <span className={`absolute inset-x-[-20%] bottom-0 block h-10 rounded-[50%] border-4 border-[color:var(--np-brass)] bg-[color:var(--np-teal-deep)] ${end.pad}`} aria-hidden="true" />
            <button type="button" onClick={() => setEncore((now) => now + 1)} className="absolute inset-x-0 bottom-4 top-0 focus:outline-none" aria-label={warp.danceAgain}>
              <span key={encore} className={`relative block h-full w-full ${end.hop}`}>
                <Bandicoot profession={profession} pose={triggered ? 'dance' : 'idle'} className="h-full w-full" />
                <MaskCompanion />
              </span>
            </button>
            {gem && (
              <span className={`absolute -right-6 top-0 block h-14 w-12 ${ui.award}`} aria-hidden="true">
                <Gem className="h-full w-full" />
              </span>
            )}
          </div>
          <ul className="mt-6 space-y-2">
            {rows.map((row, index) => (
              <TallyRow key={row.key} row={row} index={index} on={triggered} />
            ))}
          </ul>
          {gem && <p className="mt-3 text-base font-bold text-[color:var(--np-gold)]">{hud.gemAwarded}</p>}
        </div>
        <RecruiterHero
          render={({ line, actions }) => (
            <div>
              <h2 id="np-contact" className={`text-4xl ${ui.display}`}>
                {sections.contact}
              </h2>
              <p className="mt-4 text-lg text-[color:var(--np-white)]">{line}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <HeroActions actions={actions} />
                <CVLink />
              </div>
            </div>
          )}
        />
      </div>
    </section>
  )
}
