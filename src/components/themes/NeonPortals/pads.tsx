'use client'

import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { FACE } from './cards'
import { PORTAL } from './palette'

// The profession switch as the warp room's pads (research part 1 [33][39]): three real buttons, each a
// small glossy pad in its colour beside the profession and its field, in PROFESSION_ORDER as the hub's
// arc draws them, red drummer, blue engineer, gold fighter. The shared switch owns the pick and the arrow
// keys; picking one sends him hopping to that pad in the hero's scene (hero.tsx).

/** Each profession's pad: its lit dome and its deep rim, shared by the switch and the hub's arc. */
export const PAD_COLOURS: Record<Profession, { lit: string; deep: string }> = {
  drummer: { lit: PORTAL.PAD_RED, deep: PORTAL.PAD_RED_DEEP },
  engineer: { lit: PORTAL.PAD_BLUE, deep: PORTAL.PAD_BLUE_DEEP },
  fighter: { lit: PORTAL.PAD_GOLD, deep: PORTAL.PAD_GOLD_DEEP },
}

/** A pad seen from the front: its rim, its dome and the dome's shine. */
export function PadGlyph({ profession, className = '' }: { profession: Profession; className?: string }) {
  const { lit, deep } = PAD_COLOURS[profession]
  return (
    <svg viewBox="0 0 48 22" className={className} aria-hidden="true" focusable="false">
      <ellipse cx={24} cy={14} rx={22} ry={7} fill={deep} stroke={PORTAL.INK} strokeWidth={2} />
      <ellipse cx={24} cy={10.5} rx={19} ry={6} fill={lit} stroke={PORTAL.INK} strokeWidth={1.6} />
      <path d="M12 9 Q20 5.5 30 7" fill="none" stroke={PORTAL.WHITE} strokeWidth={2} strokeLinecap="round" opacity={0.8} />
    </svg>
  )
}

function Pad({ option, field }: { option: ProfessionOption; field: string }) {
  return (
    <button
      type="button"
      {...option.optionProps}
      className={`group flex min-h-[44px] w-full items-center gap-3 rounded-2xl border-[3px] px-3 py-2 text-left transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${
        option.selected
          ? 'border-[color:var(--np-gold)] bg-[color:var(--np-panel)] shadow-[0_4px_0_var(--np-gold)]'
          : 'border-[color:var(--np-seam)] bg-[color:var(--np-chamber)] shadow-[0_4px_0_var(--np-ink)]'
      }`}
    >
      <PadGlyph profession={option.id} className="h-8 w-16 shrink-0" />
      <span className="flex min-w-0 flex-col">
        <span className={`${FACE} text-lg tracking-wide ${option.selected ? 'text-[color:var(--np-gold)]' : 'text-[color:var(--np-white)]'}`}>{option.label}</span>
        <span className="text-sm text-[color:var(--np-muted)]">{field}</span>
      </span>
    </button>
  )
}

export function ProfessionPads({ className = '' }: { className?: string }) {
  const { navigation, professionFields } = useLabels()
  return (
    <ProfessionSwitch
      className={`grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 ${className}`}
      label={navigation.selectYourProfession}
      renderOption={(option) => <Pad option={option} field={professionFields[option.id]} />}
    />
  )
}
