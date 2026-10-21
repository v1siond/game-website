'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { BandSlot } from '@/components/cv/BandList'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { fillLabel } from '@/lib/cv/labels'
import { CrateArt } from './crateArt'
import { Relic, Stopwatch } from './pickups'
import { useScore } from './score'
import trials from './timeTrial.module.css'
import ui from './warped.module.css'

// A band as a time trial (the relic runs of the time travel platformer, Warped, named in code only):
// the stopwatch on the card and its yellow digits. Start runs the clock through the band's years, one
// year a tick, three yellow time crates pop beside the clock as it goes, and when it stops the relic
// drops onto the card and spins into the score. Every band wins the same relic: a band is not ranked
// against another, the trial is the way in, and the relic says it was run. A trial runs once; reduced
// motion wins it at once on Start, a World Select preview shows it won.

type Trial = 'ready' | 'running' | 'won'

const TICK_MS = 140
const MIN_TICKS = 6

/** The years the clock runs through: from the band's first year to its last, or to now. */
function yearsOf(slot: BandSlot): number[] {
  const { startYear, endYear, current } = slot.band
  if (!startYear) return []
  const last = endYear ?? (current ? new Date().getUTCFullYear() : startYear)
  return Array.from({ length: Math.max(1, last - startYear + 1) }, (_, i) => startYear + i)
}

function useTrial(id: string, ticks: number) {
  const { offer, take, has } = useScore()
  const preview = usePreview()
  const [trial, setTrial] = useState<Trial>(() => (has('relics', id) || preview ? 'won' : 'ready'))
  const [tick, setTick] = useState(0)

  useEffect(() => {
    offer('relics', id)
  }, [id, offer])

  useEffect(() => {
    if (trial !== 'running') return
    if (tick >= ticks) {
      take('relics', id)
      setTrial('won')
      return
    }
    const timer = window.setTimeout(() => setTick((now) => now + 1), TICK_MS)
    return () => window.clearTimeout(timer)
  }, [trial, tick, ticks, take, id])

  const start = () => {
    if (trial !== 'ready') return
    if (!prefersReducedMotion()) {
      setTrial('running')
      return
    }
    take('relics', id)
    setTrial('won')
  }

  return { trial, tick, start }
}

export function BandTrial({ slot, index }: { slot: BandSlot; index: number }) {
  const { links, hud, warp } = useLabels()
  const { band, years, linkProps } = slot
  const run = yearsOf(slot)
  const ticks = Math.max(run.length, MIN_TICKS)
  const { trial, tick, start } = useTrial(band.id, ticks)
  const shown = run.length ? run[Math.min(Math.floor((tick / ticks) * run.length), run.length - 1)] : tick
  const clock = trial === 'won' ? (run.at(-1) ?? ticks) : shown
  const crates = Math.min(3, Math.floor((tick / ticks) * 4))

  return (
    <article className={`relative ${ui.panel} ${ui.rise} p-5`} style={{ '--i': index } as CSSProperties} data-trial={trial}>
      <div className="flex items-start gap-4">
        <span className="relative block h-16 w-16 shrink-0" aria-hidden="true">
          <Stopwatch className="h-full w-full" hand={trial === 'running' ? trials.hand : ''} />
        </span>
        <div className="min-w-0">
          <h3 className={`text-xl leading-tight ${ui.display}`}>
            {linkProps ? (
              <a {...linkProps} className="underline decoration-[color:var(--np-orange-deep)] decoration-4 underline-offset-4">
                {band.name}
              </a>
            ) : (
              band.name
            )}
          </h3>
          <p className="mt-1 text-sm font-bold uppercase tracking-wide text-[color:var(--np-violet)]">{band.role}</p>
          {years && <p className="mt-1 text-sm text-[color:var(--np-white)]">{years}</p>}
          {band.release && (
            <p className="mt-2 text-base text-[color:var(--np-white)]">
              {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p className="flex items-center gap-2 rounded-xl border-[3px] border-[color:var(--np-void)] bg-[color:var(--np-void)] px-3 py-1 shadow-[inset_0_0_0_2px_var(--np-seam)]">
          <span className={`text-sm uppercase text-[color:var(--np-white)] ${ui.chunk}`}>{hud.time}</span>
          <span className={`text-xl tabular-nums text-[color:var(--np-teal)] ${ui.chunk}`}>{clock}</span>
        </p>
        <span className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`block h-8 w-8 ${i < crates || trial === 'won' ? trials.timeCrate : 'opacity-0'}`}>
              <CrateArt kind="question" className="h-full w-full" />
            </span>
          ))}
        </span>
        {trial === 'won' ? (
          <p className="flex items-center gap-2 text-base font-black uppercase text-[color:var(--np-gold)]">
            <span className={`block h-10 w-10 ${trials.relic}`} aria-hidden="true">
              <Relic className="h-full w-full" />
            </span>
            {warp.relicWon}
          </p>
        ) : (
          <button type="button" onClick={start} disabled={trial === 'running'} className={`${ui.button} ${ui.gold}`} aria-label={fillLabel(warp.trial, { band: band.name })}>
            {hud.time}
          </button>
        )}
      </div>
    </article>
  )
}
