'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import look from './jungle.module.css'
import charge from './rhino.module.css'

// The ventures rammed open by the source's rhino buddy, who charges through whatever stands in the way.
// When the level scrolls in he rides the rhino across the trail over the cards, head down, horn first;
// as the charge passes each venture its card is knocked sideways and rocks back. Charge again runs it
// once more.
//
// Pattern: a charge count remounts the trail and the cards, so the CSS plays again; no timers.

// The rhino side on, facing right: grey hide, a big ivory horn, a small one behind it, four trotting legs.
export function Rhino() {
  return (
    <svg viewBox="0 0 120 70" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <ellipse cx="58" cy="66" rx="44" ry="3.5" fill={C.shadow} opacity="0.35" />
      {[30, 44, 72, 86].map((x, i) => (
        <rect key={x} x={x} y="44" width="10" height="20" rx="4" fill={i % 2 ? C.rhinoDark : C.rhino} className={i % 2 ? charge.legB : charge.legA} />
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

export function RhinoCharge({ children }: { children: ReactNode }) {
  const { jungle } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.2 })
  const [charges, setCharges] = useState(0)
  const started = useRef(false)

  // The first charge runs once, on arrival.
  useEffect(() => {
    if (!triggered || started.current) return
    started.current = true
    setCharges(1)
  }, [triggered])

  return (
    <div ref={ref} key={charges} data-charging={charges > 0 || undefined} className={charge.trail}>
      <div className="relative mb-4 h-24 overflow-hidden sm:h-28" aria-hidden="true">
        <div className={`absolute inset-0 ${charge.runner}`}>
          <div className={`absolute bottom-1 left-0 w-28 sm:w-32 ${charge.gallop}`}>
            <HeroCharacter profession="engineer" pose="run" className="absolute bottom-[52%] left-[22%] w-[42%]" />
            <Rhino />
          </div>
        </div>
      </div>
      <div className={charge.cards}>{children}</div>
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={() => setCharges((count) => count + 1)} className={`min-h-[44px] rounded-xl px-5 text-base ${look.button} ${look.buttonWood} ${look.focus}`}>
          {jungle.charge}
        </button>
      </div>
    </div>
  )
}
