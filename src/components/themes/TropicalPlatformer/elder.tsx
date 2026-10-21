'use client'

import { useState, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { BarrelArt } from './barrel'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import look from './jungle.module.css'
import yard from './elder.module.css'

// About in the old timer's yard. A barrel cannon at the left fires him in rolled into a ball; he lands,
// stands and pounds his chest, and the about board unfolds under him from its top edge. At the right the
// old ape of the source rocks in his chair with his cane and grumbles at the visitor from a speech
// bubble, the way the source's grandfather comments from his cabin; asking again gets the next grumble.
//
// Pattern: CSS off the level's one trigger (data-on): the flight 0 to 0.8 s, the stand from 0.8 s, the
// board from 0.9 s. React state only for which line the old timer says.

// The old timer in his rocking chair, side on, facing left toward him: the slatted chair back, the
// curved rocker, a hunched body, a bald head with white tufts, a long white beard and the cane.
export function OldTimer() {
  return (
    <svg viewBox="0 0 100 110" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <ellipse cx="52" cy="106" rx="40" ry="3.5" fill={C.shadow} opacity="0.35" />
      <g className={yard.rock}>
        <path d="M8 98 Q50 112 94 96" fill="none" stroke={C.barkDark} strokeWidth="5" strokeLinecap="round" />
        <path d="M30 100 V84 M76 98 V84" stroke={C.bark} strokeWidth="4" />
        {[58, 66, 74, 82].map((x, i) => (
          <path key={x} d={`M${x} 84 L${x + 6 + i} 18`} stroke={i % 2 ? C.plank : C.plankLight} strokeWidth="7" strokeLinecap="round" />
        ))}
        <path d="M24 82 H84" stroke={C.bark} strokeWidth="6" strokeLinecap="round" />
        <path d="M40 80 C34 60 40 42 56 40 C70 40 76 56 74 80 Z" fill={C.elderFur} />
        <path d="M30 80 Q26 92 36 96 H46 Q40 90 42 80 Z" fill={C.elderFur} />
        <ellipse cx="36" cy="97" rx="7" ry="3" fill={C.elderSkin} />
        <circle cx="48" cy="32" r="14" fill={C.elderFur} />
        <path d="M36 30 C36 22 42 18 48 19 C42 22 40 26 40 32 Z" fill={C.elderBeard} opacity="0.85" />
        <ellipse cx="41" cy="34" rx="9" ry="8" fill={C.elderSkin} />
        <path d="M33 29 Q38 25 44 28" fill="none" stroke={C.elderBeard} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="38" cy="31.5" r="1.6" fill={C.shadow} />
        <path d="M34 38 C30 52 36 66 44 70 C46 58 50 46 48 38 Z" fill={C.elderBeard} />
        <path d="M37 44 Q40 54 43 62" fill="none" stroke={C.hoopLight} strokeWidth="1" opacity="0.7" />
        <path d="M48 52 C40 56 32 60 26 62" stroke={C.elderFur} strokeWidth="7" strokeLinecap="round" />
        <circle cx="25" cy="62" r="4.5" fill={C.elderSkin} />
        <path d="M22 40 Q24 34 30 36 M24 38 L20 100" fill="none" stroke={C.barkDark} strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

const LINES = ['elderSays1', 'elderSays2', 'elderSays3'] as const

/** About: he is fired into the old timer's yard, the board opens, the old timer grumbles. */
export function ElderYard({ children }: { children: ReactNode }) {
  const { jungle } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.2 })
  const [line, setLine] = useState(0)

  return (
    <div ref={ref} data-on={triggered || undefined} className={yard.yard}>
      <div className="relative mx-auto h-44 max-w-4xl sm:h-48" aria-hidden="true">
        <div className={`absolute bottom-2 left-0 w-14 sm:w-16 ${yard.cannon}`}>
          <BarrelArt mark="burst" className="block h-auto w-full" />
        </div>
        <div className={`pointer-events-none absolute inset-0 ${yard.flyX}`}>
          <div className={`absolute bottom-2 left-2 h-20 w-14 sm:h-24 sm:w-16 ${yard.flyY}`}>
            <HeroCharacter profession="engineer" pose="roll" className="h-full w-full" />
          </div>
        </div>
        <div className={`absolute bottom-2 left-[calc(32%+0.5rem)] h-20 w-14 sm:h-24 sm:w-16 ${yard.standing}`}>
          <HeroCharacter profession="engineer" pose="idle" className="h-full w-full" />
        </div>
        <div className="absolute bottom-0 right-0 w-24 sm:w-28">
          <OldTimer />
        </div>
      </div>

      <div className="mx-auto -mt-2 mb-4 flex max-w-4xl flex-col items-end gap-2">
        <p aria-live="polite" className={`relative max-w-sm rounded-2xl px-4 py-3 text-base text-[color:var(--tp-bark-dark)] ${yard.bubble}`}>
          {jungle[LINES[line]]}
        </p>
        <button
          type="button"
          onClick={() => setLine((current) => (current + 1) % LINES.length)}
          className={`min-h-[44px] rounded-xl px-4 text-sm ${look.button} ${look.buttonWood} ${look.focus}`}
        >
          {jungle.elderAsk}
        </button>
      </div>

      <div className={yard.unfold}>{children}</div>
    </div>
  )
}
