import type { ReactNode } from 'react'
import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { TRAIL } from './palette'

// The profession pick as a trail fork: one wooden sign per path, the picked one raised and painted route
// red with its landmark lit: the glyph stone of the ruins, the campfire of the clearing, the temple
// terrace ring.

const LANDMARK: Record<Profession, ReactNode> = {
  engineer: (
    <>
      <path d="M8 30 V10 L16 4 L24 10 V30 Z" fill={TRAIL.STONE} />
      <path d="M12 14 H16 V20 H20 M16 20 V26" stroke={TRAIL.RUNE} strokeWidth={1.6} fill="none" />
    </>
  ),
  drummer: (
    <>
      <path d="M6 30 L26 24 M6 24 L26 30" stroke={TRAIL.WOOD} strokeWidth={2.5} />
      <path d="M16 6 Q22 14 19 20 Q22 18 21 24 H11 Q10 18 13 20 Q10 14 16 6 Z" fill={TRAIL.GOLD} />
    </>
  ),
  fighter: (
    <>
      <rect x={4} y={10} width={2.5} height={20} fill={TRAIL.WOOD} />
      <rect x={25.5} y={10} width={2.5} height={20} fill={TRAIL.WOOD} />
      <path d="M5 14 H27 M5 19 H27 M5 24 H27" stroke={TRAIL.ROUTE} strokeWidth={1.5} />
    </>
  ),
}

const SIGN_LOOK = {
  picked: '-translate-y-1 border-[color:var(--ap-gold)] bg-[color:var(--ap-route)] text-white',
  open: 'border-[color:var(--ap-bark)] bg-[color:var(--ap-wood)] text-[color:var(--ap-parchment)] hover:-translate-y-0.5',
}

export function TrailSign({ id, label, selected, optionProps }: ProfessionOption) {
  return (
    <button
      type="button"
      {...optionProps}
      className={`flex min-h-[44px] flex-col items-center gap-1 rounded-sm border-2 px-2 py-2 text-sm font-bold transition-transform motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ap-gold)] sm:px-4 ${
        SIGN_LOOK[selected ? 'picked' : 'open']
      }`}
    >
      <svg viewBox="0 0 32 32" className="h-10 w-10 rounded-sm bg-[color:var(--ap-night)] sm:h-12 sm:w-12" aria-hidden="true" focusable="false">
        {LANDMARK[id]}
      </svg>
      <span className="text-center">{label}</span>
    </button>
  )
}
