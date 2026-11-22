'use client'

import { memo, useCallback, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { drumsSince } from '@/lib/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { Band, Musician } from '@/lib/cv/content'
import { cssVars } from '@/lib/cssVars'
import { StatusLine, jungleButton } from './buttons'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import look from './jungle.module.css'
import grove from './vines.module.css'
import motion from './motion.module.css'

// The bands as a grove of hanging planks under the dusk vines: each band hangs from two leafy vines
// and sways when pointed at or focused. He hangs by one hand from the vine of the band he is at, legs
// loose, swaying on it the way the source's ropes swing. Swing here sends him over: he lets go of the
// old vine and swings in on the new one, overshooting and settling like a pendulum; the band he hangs
// from lifts as the one being played.
//
// Pattern: React state for the band he is on and a count that remounts the swing in; the pendulum is CSS
// round the hand on the vine.

function Vines() {
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-full h-10 w-full" aria-hidden="true" focusable="false">
      {[40, 160].map((x) => (
        <g key={x}>
          <path d={`M${x} 0 Q${x - 6} 14 ${x} 24 T${x} 40`} fill="none" stroke={C.moss} strokeWidth="4" />
          <path d={`M${x} 12 q10 -6 14 2 q-8 2 -14 -2 Z M${x} 26 q-10 -6 -14 2 q8 2 14 -2 Z`} fill={C.fern} />
        </g>
      ))}
    </svg>
  )
}

interface CardProps {
  slot: BandSlot
  index: number
  here: boolean
  // Whether the grove has scrolled in: from then on he swings in on each band he moves to.
  entered: boolean
  // The swing count keys his swing in, so only the card he hangs from gets it; the others get 0.
  swings: number
  onSwing: (index: number) => void
}

const HangingBand = memo(function HangingBand({ slot, index, here, entered, swings, onSwing }: CardProps) {
  const { jungle } = useLabels()
  const { band, years, linkProps, release } = slot

  return (
    <div className={`relative pt-10 ${grove.hang}`} style={cssVars({ '--i': index })}>
      <article data-here={here || undefined} className={`relative rounded-3xl p-5 ${look.board} ${grove.card}`}>
        <Vines />
        {here && (
          <div key={swings} className={`pointer-events-none absolute -top-12 right-[12%] z-10 w-16 ${entered ? motion.swingIn : motion.swing}`} aria-hidden="true">
            <HeroCharacter profession="drummer" pose="swing" waiting={!entered} className="block h-auto w-full" />
          </div>
        )}
        <h3 className={`pr-20 text-lg leading-snug text-[color:var(--tp-sun-gold)] ${look.display}`}>
          {linkProps ? (
            <a {...linkProps} className={`underline decoration-2 underline-offset-4 ${look.focus}`}>
              {band.name}
            </a>
          ) : (
            band.name
          )}
        </h3>
        {band.role && <p className="mt-1 pr-20 text-base text-[color:var(--tp-parchment)]">{band.role}</p>}
        {years && <p className="mt-1 text-sm text-[color:var(--tp-plank-light)]">{years}</p>}
        {release && (
          <p className="mt-2 text-sm text-[color:var(--tp-parchment)]">
            <span className="font-bold text-[color:var(--tp-sun-gold)]">{release.label}: </span>
            {release.title}
          </p>
        )}
        <button
          type="button"
          onClick={() => onSwing(index)}
          aria-pressed={here}
          aria-label={fillLabel(jungle.swingTo, { band: band.name })}
          className={jungleButton({ tone: here ? 'gold' : 'wood', size: 'small', extra: 'mt-4 inline-flex items-center' })}
        >
          {here ? jungle.swingHere : jungle.swing}
        </button>
      </article>
    </div>
  )
})

/** The bands hanging from vines; he swings from band to band. */
export function VineBands({ bands, musician }: { bands: Band[]; musician: Musician }) {
  const labels = useLabels()
  const { ref, triggered } = useSectionTrigger()
  const [{ at, swings }, setSwing] = useState({ at: 0, swings: 0 })

  const swingTo = useCallback((index: number) => setSwing((now) => (index === now.at ? now : { at: index, swings: now.swings + 1 })), [])

  if (bands.length === 0) return null
  // Each swing lands him on `at`; before the first he has swung to nothing.
  const status = swings > 0 ? fillLabel(labels.jungle.swingAt, { band: bands[at].name }) : ''

  return (
    <div ref={ref} data-on={triggered || undefined} className={grove.grove}>
      <p className={`mx-auto mb-10 w-fit rounded-xl px-5 py-2 text-center text-base text-[color:var(--tp-parchment)] ${look.board}`}>{drumsSince(musician, labels.years)}</p>
      <BandList
        bands={bands}
        className={MASONRY_LIST}
        itemClassName={`${MASONRY_ITEM} pt-6`}
        renderBand={(slot, index) => <HangingBand slot={slot} index={index} here={index === at} entered={triggered} swings={index === at ? swings : 0} onSwing={swingTo} />}
      />
      <StatusLine>{status}</StatusLine>
    </div>
  )
}
