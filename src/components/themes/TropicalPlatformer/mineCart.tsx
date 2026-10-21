'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import { CaveCeiling } from './scenery'
import look from './jungle.module.css'
import cart from './mineCart.module.css'

// A mine cart line over a list: a rail strip with one station per stop, broken between stations as the
// source's cart levels are, and him in the cart. Each stop's card carries a RideButton; the cart rolls
// to that stop's station, hopping every broken gap on the way, its wheels turning while it rides, and
// the card lights up as the stop. When the section scrolls in the cart rolls in to the first stop. The
// projects ride it (projects.tsx).
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

/** The ride button on a stop's card: pressed while the cart stands there. */
export function RideButton({ name, here, onRide }: { name: string; here: boolean; onRide: () => void }) {
  const { jungle } = useLabels()
  return (
    <button
      type="button"
      onClick={onRide}
      aria-pressed={here}
      aria-label={fillLabel(jungle.rideTo, { stop: name })}
      className={`mt-4 inline-flex min-h-[44px] items-center rounded-xl px-4 text-sm ${look.button} ${here ? look.buttonGold : look.buttonWood} ${look.focus}`}
    >
      {here ? jungle.cartHere : jungle.ride}
    </button>
  )
}

/** The cart's stop and the ride to another one, handed to the list under the rails. */
export interface CartStop {
  stop: number
  rideTo: (index: number) => void
}

interface CartLineProps {
  stops: string[]
  profession: Profession
  children: (cart: CartStop) => ReactNode
}

/** A mine cart line with one station per stop; the visitor rides the cart from stop to stop. */
export function CartLine({ stops, profession, children }: CartLineProps) {
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
    setStatus(fillLabel(labels.jungle.cartAt, { stop: stops[index] }))
    setStop(index)
    if (prefersReducedMotion()) return
    setRide((current) => ({ count: current.count + 1, hops: Math.abs(index - stop) }))
    setRiding(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setRiding(false), RIDE_MS)
  }

  if (stops.length === 0) return null

  return (
    <div ref={ref} data-on={triggered || undefined} className={cart.line}>
      <div className={`relative mb-10 h-32 overflow-hidden rounded-3xl sm:h-36 ${cart.tunnel}`} style={{ '--n': stops.length } as CSSProperties} aria-hidden="true">
        <CaveCeiling />
        <Rails stations={stops.length} />
        <div className={`absolute bottom-2 left-0 ${cart.track}`} style={{ '--stop': stop } as CSSProperties} data-riding={riding || undefined}>
          <div key={ride.count} className={`relative mx-auto w-full max-w-[6rem] ${cart.hop}`} style={{ '--hops': Math.max(ride.hops, 1) } as CSSProperties}>
            <HeroCharacter profession={profession} pose={riding ? 'run' : 'idle'} className="absolute bottom-[45%] left-[12%] w-[76%]" />
            <Cart />
          </div>
        </div>
      </div>

      {children({ stop, rideTo })}

      <p role="status" className={`mt-2 min-h-[1.5rem] text-center text-base text-[color:var(--tp-sun-gold)] ${look.caption}`}>
        {status}
      </p>
    </div>
  )
}

/** The class a stop's card wears: lifted and gold edged while the cart stands at it (data-here). */
export const STATION = cart.station
