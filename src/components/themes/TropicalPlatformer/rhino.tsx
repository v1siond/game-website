'use client'

import { Fragment, useState, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import { jungleButton } from './buttons'
import charge from './rhino.module.css'

// The ventures rammed open by the source's rhino buddy, who charges through whatever stands in the way.
// When the level scrolls in he rides the rhino across the trail over the cards, head down, horn first;
// as the charge passes each venture its card is knocked sideways and rocks back. Charge again runs it
// once more.
//
// Pattern: a charge count remounts the runner and the cards, so the CSS plays again; no timers. The
// root (its observer and data-charging) and the Charge button stay mounted, so focus stays on the button.

const CHARGE_BUTTON = jungleButton({ tone: 'wood', size: 'large' })

// His four legs, every other one the far side's, darker, trotting a beat apart.
const LEGS = [
  { x: 30, fill: C.rhino, pair: charge.legA },
  { x: 44, fill: C.rhinoDark, pair: charge.legB },
  { x: 72, fill: C.rhino, pair: charge.legA },
  { x: 86, fill: C.rhinoDark, pair: charge.legB },
]

// The rhino side on, facing right: grey hide, a big ivory horn, a small one behind it, four trotting legs.
export function Rhino() {
  return (
    <svg viewBox="0 0 120 70" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <ellipse cx="58" cy="66" rx="44" ry="3.5" fill={C.shadow} opacity="0.35" />
      {LEGS.map(({ x, fill, pair }) => (
        <rect key={x} x={x} y="44" width="10" height="20" rx="4" fill={fill} className={pair} />
      ))}
      <path d="M18 34 C18 18 38 12 62 13 C84 14 98 22 100 34 C100 46 88 52 60 52 C34 52 18 48 18 34 Z" fill={C.rhino} />
      <path d="M24 40 C40 48 80 48 98 38" fill="none" stroke={C.rhinoDark} strokeWidth="2.5" opacity="0.6" />
      <path d="M92 22 C102 20 114 26 116 36 C116 44 108 46 100 44 C94 40 90 30 92 22 Z" fill={C.rhino} />
      <path d="M108 26 L118 6 L112 28 Z" fill={C.horn} />
      <path d="M100 24 L104 14 L104 25 Z" fill={C.horn} />
      <path d="M94 18 L92 10 L98 16 Z" fill={C.rhinoDark} />
      <circle cx="102" cy="30" r="1.8" fill={C.shadow} />
      <path d="M18 30 Q10 30 8 38" fill="none" stroke={C.rhinoDark} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/** The class of a venture card the charge rams. */
export const RAMMED = charge.item

export function RhinoCharge({ children }: { children: ReactNode }) {
  const { jungle } = useLabels()
  const [charges, setCharges] = useState(0)
  // The first charge runs once, on arrival.
  const { ref } = useSectionTrigger({ threshold: 0.2, onEnter: () => setCharges(1) })

  return (
    <div ref={ref} data-charging={charges > 0 || undefined} className={charge.trail}>
      <Fragment key={charges}>
        <div className="relative mb-4 h-24 overflow-hidden sm:h-28" aria-hidden="true">
          <div className={`absolute inset-0 ${charge.runner}`}>
            <div className={`absolute bottom-1 left-0 w-28 sm:w-32 ${charge.gallop}`}>
              <HeroCharacter profession="engineer" pose="run" className="absolute bottom-[52%] left-[22%] w-[42%]" />
              <Rhino />
            </div>
          </div>
        </div>
        <div>{children}</div>
      </Fragment>
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={() => setCharges((count) => count + 1)} className={CHARGE_BUTTON}>
          {jungle.charge}
        </button>
      </div>
    </div>
  )
}
