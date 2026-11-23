'use client'

import type { ReactNode } from 'react'
import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import look from './jungle.module.css'
import css from './selector.module.css'

// One option of the shared profession switch, a wooden plate on the jungle path: him in that profession's
// clothes, its insignia, its name and field, and a check when it is picked. The picked plate turns sun
// gold and he waves from it.

// Each profession's insignia, drawn in a 40 by 40 box in the ink given.
const INSIGNIA: Record<Profession, (ink: string) => ReactNode> = {
  engineer: (ink) => (
    <path
      d="M27 6 a8 8 0 0 0 -8 10 L7 28 a3.5 3.5 0 0 0 5 5 L24 21 a8 8 0 0 0 10 -8 l-5 5 -5 -1 -1 -5 Z"
      fill={ink}
    />
  ),
  drummer: (ink) => (
    <>
      <ellipse cx="20" cy="24" rx="13" ry="5" fill="none" stroke={ink} strokeWidth="2.5" />
      <path d="M7 24 V31 Q20 38 33 31 V24" fill="none" stroke={ink} strokeWidth="2.5" />
      <path d="M11 4 L19 20 M29 4 L21 20" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  fighter: (ink) => (
    <>
      <path d="M11 15 Q11 6 20 6 Q30 6 30 16 V25 Q30 32 22 32 H16 Q10 32 10 26 Z" fill={ink} />
      <path d="M11 35 H29" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
}

export function Plate({ id, label, selected, optionProps }: ProfessionOption) {
  const { professionFields } = useLabels()

  return (
    <button
      type="button"
      {...optionProps}
      data-selected={selected || undefined}
      className={`flex min-h-[44px] w-full items-center gap-4 rounded-2xl px-4 py-3 text-left ${look.focus} ${css.plate}`}
    >
      <HeroCharacter profession={id} pose={selected ? 'wave' : 'idle'} className="h-16 w-10 flex-shrink-0" />
      <svg viewBox="0 0 40 40" className="h-8 w-8 flex-shrink-0" aria-hidden="true" focusable="false">
        {INSIGNIA[id](selected ? C.barkDark : C.sunGold)}
      </svg>
      <span className="min-w-0 flex-1">
        <span className={`block text-lg uppercase ${look.display}`}>{label}</span>
        <span className="block text-sm">{professionFields[id]}</span>
      </span>
      <svg viewBox="0 0 24 24" className={`h-7 w-7 flex-shrink-0 ${css.check}`} aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="11" fill={C.barkDark} />
        <path d="M6.5 12.5 L10.5 16.5 L17.5 8" fill="none" stroke={C.sunGold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
