'use client'

import { useProfession } from '@/contexts/ProfessionContext'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import cross from './crossing.module.css'

// A gap between two levels crossed the way the source crosses its gaps: two vines hang from the canopy;
// when the gap scrolls in he swings on the first, lets go at the top of the swing, flies across and
// catches the second, which carries him through a damped swing until he hangs there, swaying, in the
// picked profession's look. Decoration only: the gap has no text and no control.
//
// Pattern: CSS off one trigger (data-on): a full width layer carries him across (2.2 s) over an inner
// layer for the arcs and the swing angle; the vines sway on their own tops.

function Vine({ left, late }: { left: string; late?: boolean }) {
  return (
    <svg viewBox="0 0 20 100" preserveAspectRatio="none" className={`absolute top-0 h-[70%] w-5 ${cross.vine} ${late ? cross.vineLate : ''}`} style={{ left }} aria-hidden="true" focusable="false">
      <path d="M10 0 Q4 25 10 50 T10 100" fill="none" stroke={C.moss} strokeWidth="4" />
      <path d="M10 22 q8 -5 10 2 q-6 2 -10 -2 Z M10 58 q-8 -5 -10 2 q6 2 10 -2 Z" fill={C.fern} />
    </svg>
  )
}

export function VineCrossing() {
  const { active } = useProfession()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.4 })

  return (
    <div ref={ref} data-on={triggered || undefined} className={`relative mx-auto h-48 max-w-4xl ${cross.gap}`} aria-hidden="true">
      <Vine left="calc(18% - 0.625rem)" />
      <Vine left="calc(68% - 0.625rem)" late />
      <div className={`pointer-events-none absolute inset-0 ${cross.carry}`}>
        <div className={`absolute left-[calc(18%-0.8rem)] top-[calc(70%-0.7rem)] w-16 ${cross.arc}`}>
          <HeroCharacter profession={active} pose="swing" className="block h-auto w-full" />
        </div>
      </div>
    </div>
  )
}
