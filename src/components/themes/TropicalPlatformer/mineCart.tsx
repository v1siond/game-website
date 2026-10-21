'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { drumsSince } from '@/components/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import type { Band, Musician } from '@/lib/cv/content'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import { CaveCeiling } from './scenery'
import look from './jungle.module.css'
import cart from './mineCart.module.css'

// The bands as a mine cart ride: a rail strip with one station per band, broken between stations as the
// source's cart levels are, and him in the cart. Each band's card has a ride button; the cart rolls to
// that band's station, hopping every broken gap on the way, its wheels turning while it rides, and the
// band's card lights up as the stop. When the section scrolls in the cart rolls in to the first band.
//
// Pattern: the stop is a CSS variable (--stop, in station widths); the hop count (--hops) is the number
// of gaps crossed and sets the hop's iteration count, remounted per ride; one timer ends the ride.

const RIDE_MS = 1100

function Cart() {
  return (
    <svg viewBox="0 0 80 40" className="relative block h-auto w-full" aria-hidden="true" focusable="false">
      <path d="M6 4 H74 L68 30 H12 Z" fill="url(#tp-hoop)" />
      <path d="M6 4 H74" stroke={C.hoop} strokeWidth="3" />
      <path d="M10 14 H70 M12 22 H68" stroke={C.hoop} strokeWidth="1.5" opacity="0.6" />
      {[22, 58].map((cx) => (
        <g key={cx} className={cart.wheel} style={{ '--cx': `${cx}px` } as CSSProperties}>
          <circle cx={cx} cy="32" r="7" fill={C.barkDark} stroke={C.hoopLight} strokeWidth="2" />
          <path d={`M${cx - 6} 32 H${cx + 6} M${cx} 26 V38`} stroke={C.hoopLight} strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  )
}

function Rails({ stations }: { stations: number }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-4" aria-hidden="true">
      {Array.from({ length: stations }, (_, i) => (
        <div key={i} className="flex flex-1 items-end justify-center">
          <span className={`block h-3 w-[78%] ${cart.rail}`} />
        </div>
      ))}
    </div>
  )
}

interface StationCardProps {
  slot: BandSlot
  here: boolean
  onRide: () => void
}

function StationCard({ slot, here, onRide }: StationCardProps) {
  const { jungle, links } = useLabels()
  const { band, years, linkProps } = slot

  return (
    <article data-here={here || undefined} className={`rounded-3xl p-5 ${look.board} ${cart.station}`}>
      <h3 className={`text-lg leading-snug text-[color:var(--tp-sun-gold)] ${look.display}`}>
        {linkProps ? (
          <a {...linkProps} className={`underline decoration-2 underline-offset-4 ${look.focus}`}>
            {band.name}
          </a>
        ) : (
          band.name
        )}
      </h3>
      {band.role && <p className="mt-1 text-base text-[color:var(--tp-parchment)]">{band.role}</p>}
      {years && <p className="mt-1 text-sm text-[color:var(--tp-plank-light)]">{years}</p>}
      {band.release && (
        <p className="mt-2 text-sm text-[color:var(--tp-parchment)]">
          <span className="font-bold text-[color:var(--tp-sun-gold)]">{links.released}: </span>
          {band.release}
        </p>
      )}
      <button
        type="button"
        onClick={onRide}
        aria-pressed={here}
        aria-label={fillLabel(jungle.rideTo, { band: band.name })}
        className={`mt-4 inline-flex min-h-[44px] items-center rounded-xl px-4 text-sm ${look.button} ${here ? look.buttonGold : look.buttonWood} ${look.focus}`}
      >
        {here ? jungle.cartHere : jungle.ride}
      </button>
    </article>
  )
}

/** The bands as stations on a mine cart line; the visitor rides the cart from band to band. */
export function CartRide({ bands, musician }: { bands: Band[]; musician: Musician }) {
  const labels = useLabels()
  const { ref, triggered } = useSectionTrigger()
  const [stop, setStop] = useState(0)
  const [ride, setRide] = useState({ count: 0, hops: 0 })
  const [riding, setRiding] = useState(false)
  const [status, setStatus] = useState('')
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const rideTo = (index: number) => {
    if (index === stop) return
    setStatus(fillLabel(labels.jungle.cartAt, { band: bands[index].name }))
    setStop(index)
    if (prefersReducedMotion()) return
    setRide((current) => ({ count: current.count + 1, hops: Math.abs(index - stop) }))
    setRiding(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setRiding(false), RIDE_MS)
  }

  if (bands.length === 0) return null

  return (
    <div ref={ref} data-on={triggered || undefined} className={cart.line}>
      <p className={`mx-auto mb-8 w-fit rounded-xl px-5 py-2 text-center text-base text-[color:var(--tp-parchment)] ${look.board}`}>{drumsSince(musician, labels.years)}</p>

      <div className={`relative mb-10 h-32 overflow-hidden rounded-3xl sm:h-36 ${cart.tunnel}`} style={{ '--n': bands.length } as CSSProperties} aria-hidden="true">
        <CaveCeiling />
        <Rails stations={bands.length} />
        <div className={`absolute bottom-2 left-0 ${cart.track}`} style={{ '--stop': stop } as CSSProperties} data-riding={riding || undefined}>
          <div key={ride.count} className={`relative mx-auto w-full max-w-[6rem] ${cart.hop}`} style={{ '--hops': Math.max(ride.hops, 1) } as CSSProperties}>
            <HeroCharacter profession="drummer" pose={riding ? 'run' : 'idle'} className="absolute bottom-[45%] left-[12%] w-[76%]" />
            <Cart />
          </div>
        </div>
      </div>

      <BandList
        bands={bands}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => {
          const index = bands.indexOf(slot.band)
          return <StationCard slot={slot} here={index === stop} onRide={() => rideTo(index)} />
        }}
      />

      <p role="status" className={`mt-2 min-h-[1.5rem] text-center text-base text-[color:var(--tp-sun-gold)] ${look.caption}`}>
        {status}
      </p>
    </div>
  )
}
