'use client'

import { useState, type CSSProperties } from 'react'
import type { Band, Musician } from '@/lib/cv/content'
import { fillLabel } from '@/lib/cv/labels'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { drumsSince } from '@/components/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { HudPanel } from './hud'
import { MercSprite, type MercMotion } from './merc'
import { Scannable } from './scanner'
import world from './world.module.css'

// The bands as the car radio's presets: a dial runs across the top with each band as a station mark,
// and pointing at a band (or focusing it) swings the needle to its mark and plays the equaliser on its
// preset. The current band is tuned at first. A band with a site opens its stream link.

const EQ_BARS = [0, 1, 2, 3, 4]

function Preset({ slot, number, tuned, onTune }: { slot: BandSlot; number: number; tuned: boolean; onTune: () => void }) {
  const { links, actions, sections } = useLabels()
  const { band, years, linkProps } = slot

  return (
    <Scannable kind="use" title={sections.bands} fact={years || band.role}>
      <article
        onPointerEnter={onTune}
        onFocus={onTune}
        className={`${tuned ? world.tuned : ''} border bg-[color:var(--neon-glass)] p-4 ${
          tuned ? 'border-[color:var(--neon-hud)]' : 'border-[color-mix(in_srgb,var(--neon-use)_35%,transparent)]'
        }`}
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
        {band.release && (
          <p className="mt-2 text-sm text-[color:var(--neon-ice)]">
            {links.released} <cite>{band.release}</cite>
          </p>
        )}
        {linkProps && (
          <a
            {...linkProps}
            className={`${world.cut} mt-3 inline-flex min-h-[44px] items-center border border-[color:var(--neon-use)] px-3 text-sm uppercase tracking-wider text-[color:var(--neon-use)] hover:bg-[color-mix(in_srgb,var(--neon-use)_14%,transparent)]`}
          >
            {actions.streamLink}
          </a>
        )}
      </article>
    </Scannable>
  )
}

export function Radio({ musician, bands }: { musician: Musician; bands: Band[] }) {
  const labels = useLabels()
  const { hud, sections, years } = labels
  const [tuned, setTuned] = useState(0)
  const tunedBand = bands[tuned]
  // Him on the neon snare by the dial: every band tuned in is a fill on the drum, then he rests.
  const drummer = usePoseSequence<MercMotion>({ entrance: [], rest: 'idle', still: 'still', moveMs: 700, policy: 'always' })
  const tune = (index: number) => {
    if (index !== tuned) drummer.play('drum')
    setTuned(index)
  }

  return (
    <HudPanel title={sections.bands}>
      <p className="text-sm text-[color:var(--neon-hud)]">{drumsSince(musician, years)}</p>
      <p className="mt-1 text-sm text-[color:var(--neon-ice)]">{musician.line}</p>

      {/* the dial: the station marks, the needle on the tuned band */}
      <div className="mt-5 flex items-end gap-3">
      <span className="block w-14 shrink-0 sm:w-16" aria-hidden="true">
        <MercSprite key={drummer.take} profession="drummer" motion={drummer.move ?? drummer.pose} className="h-auto w-full" />
      </span>
      <div className="min-w-0 flex-1 border border-[color-mix(in_srgb,var(--neon-data)_45%,transparent)] bg-[color:var(--neon-ink)] px-2 pb-2 pt-3" aria-hidden="true">
        <div className="relative h-14" style={{ '--tuned': tuned, '--count': bands.length } as CSSProperties}>
          <div className="absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(90deg,var(--neon-data)_0_1px,transparent_1px_10px)] opacity-60" />
          <div className={`absolute inset-x-0 top-5 grid ${world.stations}`}>
            {bands.map((band, i) => (
              <span key={band.id} className={`truncate px-1 text-center text-sm ${i === tuned ? 'text-[color:var(--neon-hud)]' : 'text-[color:var(--neon-ash)]'}`}>
                {band.name}
              </span>
            ))}
          </div>
          <div className={`absolute inset-y-0 left-0 w-full ${world.needle}`}>
            <span className="absolute -top-1 bottom-0 left-0 w-0.5 -translate-x-1/2 bg-[color:var(--neon-hud)]" />
          </div>
        </div>
      </div>
      </div>
      <p className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
        <span className="text-[color:var(--neon-hud)]">{tunedBand ? fillLabel(hud.tunedTo, { name: tunedBand.name }) : ''}</span>
        <span className="text-[color:var(--neon-ash)]">{hud.tuneHint}</span>
      </p>

      <BandList
        bands={bands}
        className={`${MASONRY_LIST} mt-6`}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => {
          const index = bands.findIndex((band) => band.id === slot.band.id)
          return <Preset slot={slot} number={index + 1} tuned={index === tuned} onTune={() => tune(index)} />
        }}
      />
    </HudPanel>
  )
}
