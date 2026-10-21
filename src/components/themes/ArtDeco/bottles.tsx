import type { ReactNode } from 'react'
import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { DECO_COLORS } from './palette'
import look from './world.module.css'

// The profession switch as a row of tonic bottles from a deco vending machine: the picked one is full
// of gold with a pointer under it, the others stand empty and dim.

// The glyph each profession's bottle carries, drawn in the bottle's ink colour.
export const BOTTLE_GLYPHS: Record<Profession, (ink: string) => ReactNode> = {
  drummer: (ink) => (
    <>
      <circle cx="20" cy="20" r="10" fill="none" stroke={ink} strokeWidth="2" />
      <circle cx="20" cy="20" r="5" fill={ink} />
      <path d="M8 20 Q3 20 3 15 M32 20 Q37 20 37 15" fill="none" stroke={ink} strokeWidth="2" />
    </>
  ),
  engineer: (ink) => <path d="M20 5 L25 18 L32 18 L18 35 L22 22 L15 22 Z" fill={ink} stroke={ink} strokeWidth="1" />,
  fighter: (ink) => (
    <>
      <path d="M10 30 L20 10 L30 30" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M13 25 L27 25" stroke={ink} strokeWidth="2" />
      <circle cx="20" cy="8" r="3" fill={ink} />
    </>
  ),
}

export function TonicBottle({ id, label, selected, optionProps }: ProfessionOption) {
  const ink = selected ? DECO_COLORS.deepSea : DECO_COLORS.gold

  return (
    <button
      type="button"
      {...optionProps}
      className={`group relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F0C850] motion-safe:transition-[opacity,transform] motion-safe:duration-300 ${
        selected ? 'scale-105 sm:scale-110' : 'opacity-80 hover:opacity-100 motion-safe:hover:scale-105'
      }`}
    >
      <span
        className={`relative block border-[3px] px-3 py-4 text-center sm:p-6 ${look.bottle} ${
          selected ? `border-[#F0C850]/50 ${look.bottleFull}` : 'border-[#D4AF37]/50'
        }`}
      >
        <svg viewBox="0 0 40 40" className="mx-auto mb-3 h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true" focusable="false">
          {BOTTLE_GLYPHS[id](ink)}
        </svg>
        <span className={`block text-sm font-bold uppercase tracking-wider ${selected ? 'text-[#0A2540]' : look.neon}`}>{label}</span>
      </span>

      {selected && (
        <svg className="absolute -bottom-4 left-1/2 -translate-x-1/2" width="30" height="15" viewBox="0 0 30 15" aria-hidden="true" focusable="false">
          <path d="M0 0 L15 15 L30 0" fill={DECO_COLORS.gold} />
        </svg>
      )}
    </button>
  )
}
