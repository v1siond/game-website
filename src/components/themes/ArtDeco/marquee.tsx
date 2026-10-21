'use client'

import type { CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { drumsSince } from '@/components/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Band, Musician } from '@/lib/cv/content'
import marquee from './marquee.module.css'

// The bands as the city's theatre marquees: each band a maroon board under a stepped crown, its name in
// gold neon that buzzes on (two dips, then steady) when the row of boards comes into view, framed by a
// rim of bulbs. Pointing at a board (or focusing its link) sets the bulbs chasing round it, the way a
// marquee calls the crowd in. The years and the release sit on the board's letter rail below.
//
// Pattern: CSS off one shared section trigger for the buzz on (staggered by --i); hover and focus run
// the chase. Reduced motion: the sign is lit and the bulbs still.

function Board({ slot, index }: { slot: BandSlot; index: number }) {
  const { band, years, linkProps } = slot
  const { links } = useLabels()

  const board = (
    <div className={`relative px-5 pb-5 pt-10 ${marquee.board}`} style={{ '--i': index } as CSSProperties}>
      <svg viewBox="0 0 200 24" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-6 w-full" aria-hidden="true" focusable="false">
        <path d="M0 24 V16 H30 V8 H60 V0 H140 V8 H170 V16 H200 V24 Z" className={marquee.crown} />
      </svg>
      <span className={`pointer-events-none absolute inset-1.5 ${marquee.bulbs} ${marquee.bulbsA}`} aria-hidden="true" />
      <span className={`pointer-events-none absolute inset-1.5 ${marquee.bulbs} ${marquee.bulbsB}`} aria-hidden="true" />

      <div className="relative px-3 py-4 text-center">
        <h3 className={`text-2xl uppercase tracking-[0.18em] ${marquee.neon}`}>{band.name}</h3>
        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[color:var(--deco-cream)]">{band.role}</p>
      </div>

      <div className={`relative mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-3 py-2 text-sm ${marquee.rail}`}>
        {years && <span>{years}</span>}
        {band.release && (
          <span>
            {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
          </span>
        )}
      </div>
    </div>
  )

  if (!linkProps) return <div className={`group ${marquee.slot}`}>{board}</div>
  return (
    <a {...linkProps} className={`group block ${marquee.slot} ${marquee.link}`}>
      {board}
    </a>
  )
}

/** The bands as a masonry row of theatre marquees, the years he has played on a ticket above them. */
export function MarqueeRow({ bands, musician }: { bands: Band[]; musician: Musician }) {
  const { years } = useLabels()
  const { ref, triggered } = useSectionTrigger()

  return (
    <div ref={ref} data-on={triggered || undefined} className={marquee.row}>
      <p className={`mx-auto mb-8 w-fit px-6 py-2 text-center text-base uppercase tracking-[0.15em] ${marquee.ticket}`}>
        {drumsSince(musician, years)}
      </p>
      <BandList
        bands={bands}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => <Board slot={slot} index={bands.indexOf(slot.band)} />}
      />
      <p className="mt-6 text-center text-base italic text-[color:var(--deco-gold)]">{musician.line}</p>
    </div>
  )
}
