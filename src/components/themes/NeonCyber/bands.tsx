'use client'

import { useState, type CSSProperties } from 'react'
import type { Band, Musician } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { drumsSince } from '@/lib/cv/sectionText'
import { HUD_LINK } from './hud'
import world from './world.module.css'

// The bands as cards on the HUD: pointing at a band (or focusing it) plays the equaliser on its card, the
// current band's at first. A band with a site opens its stream link. In the scene behind, he fights the heavy
// walker, one pass per band as its card is read (scenes.tsx).

const EQ_BARS = [0, 1, 2, 3, 4]

// The band in focus is ringed in HUD yellow and plays its equaliser; the others keep a faint use blue line.
const TUNED_LOOK: Record<`${boolean}`, string> = {
  true: `${world.tuned} border-[color:var(--neon-hud)]`,
  false: 'border-[color-mix(in_srgb,var(--neon-use)_35%,transparent)]',
}

function BandCard({ slot, number, tuned, onTune }: { slot: BandSlot; number: number; tuned: boolean; onTune: () => void }) {
  const { actions } = useLabels()
  const { band, years, linkProps, release } = slot

  return (
    <article
      onPointerEnter={onTune}
      onFocus={onTune}
      className={`${TUNED_LOOK[`${tuned}`]} border bg-[color:var(--neon-glass)] p-4`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[color:var(--neon-use)]" aria-hidden="true">
            {String(number).padStart(2, '0')}
          </p>
          <h3 className="text-base text-[color:var(--neon-ice)]">{band.name}</h3>
        </div>
        <span className={`${world.eq} flex h-8 shrink-0 items-end gap-0.5`} aria-hidden="true">
          {EQ_BARS.map((i) => (
            <span key={i} className="block h-full w-1.5 bg-[color:var(--neon-hud)]" style={{ '--i': i } as CSSProperties} />
          ))}
        </span>
      </header>
      <p className="mt-1 text-sm text-[color:var(--neon-hud)]">{band.role}</p>
      {years && <p className="text-sm text-[color:var(--neon-ash)]">{years}</p>}
      {release && (
        <p className="mt-2 text-sm text-[color:var(--neon-ice)]">
          {release.label} <cite>{release.title}</cite>
        </p>
      )}
      {linkProps && (
        <a
          {...linkProps}
          className={`${HUD_LINK} mt-3`}
        >
          {actions.streamLink}
        </a>
      )}
    </article>
  )
}

export function BandDeck({ musician, bands }: { musician: Musician; bands: Band[] }) {
  const labels = useLabels()
  const { years } = labels
  const [tuned, setTuned] = useState(0)

  return (
    <>
      <div className={`${world.panel} mb-5 p-4 sm:p-5`}>
        <p className="text-sm text-[color:var(--neon-hud)]">{drumsSince(musician, years)}</p>
        <p className="mt-1 text-sm text-[color:var(--neon-ice)]">{musician.line}</p>
      </div>

      <div data-stage-items="">
        <BandList bands={bands} className="grid gap-4" renderBand={(slot, index) => <BandCard slot={slot} number={index + 1} tuned={index === tuned} onTune={() => setTuned(index)} />} />
      </div>
    </>
  )
}
