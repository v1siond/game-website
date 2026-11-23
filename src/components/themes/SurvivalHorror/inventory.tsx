import type { ReactNode } from 'react'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { SH } from './palette'
import { CORNER_MARKS } from './panels'
import look from './world.module.css'

// The profession switch as an inventory under his file card: the item in his hand and three slots, one
// item per profession (his laptop, his sticks, his hand wraps). ProfessionSwitch owns the order, the pick
// and the keyboard; this draws the screen.

const ITEM: Record<Profession, ReactNode> = {
  engineer: (
    <>
      <path d="M8 30 H40 L44 38 H4 Z" fill={SH.steel} stroke={SH.void} strokeWidth={0.8} />
      <rect x={10} y={10} width={28} height={20} rx={1.5} fill={SH.gunmetal} stroke={SH.void} strokeWidth={0.8} />
      <rect x={12.5} y={12.5} width={23} height={15} fill={SH.void} />
      <path d="M15 17 H28 M15 21 H32 M15 25 H23" stroke={SH.flame} strokeWidth={1.2} />
    </>
  ),
  drummer: (
    <>
      <line x1={10} y1={40} x2={36} y2={8} stroke={SH.brass} strokeWidth={3} strokeLinecap="round" />
      <line x1={38} y1={40} x2={12} y2={8} stroke={SH.brass} strokeWidth={3} strokeLinecap="round" />
      <circle cx={36} cy={8} r={2.2} fill={SH.cream} />
      <circle cx={12} cy={8} r={2.2} fill={SH.cream} />
    </>
  ),
  fighter: (
    <>
      <path d="M14 40 Q8 26 14 14 Q22 6 32 12 Q40 18 36 32 Q34 40 30 42 Z" fill={SH.cream} stroke={SH.void} strokeWidth={0.8} />
      <path d="M13 20 H36 M12 26 H37 M13 32 H36" stroke={SH.sepia} strokeWidth={1} />
      <path d="M20 6 Q24 2 30 6" stroke={SH.ivory} strokeWidth={2} fill="none" strokeLinecap="round" />
    </>
  ),
}

function ItemIcon({ profession, className }: { profession: Profession; className: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      {ITEM[profession]}
    </svg>
  )
}

const SLOT_LOOK = {
  on: { frame: 'border-[color:var(--sh-flame)]', corner: 'border-[color:var(--sh-flame)]', label: 'text-[color:var(--sh-ivory)]' },
  off: { frame: 'border-[color:var(--sh-wood)] hover:border-[color:var(--sh-brass)]', corner: 'border-[color:var(--sh-brass)]', label: 'text-[color:var(--sh-cream)]' },
}

function ItemSlot({ option }: { option: ProfessionOption }) {
  const slot = SLOT_LOOK[option.selected ? 'on' : 'off']

  return (
    <button
      type="button"
      {...option.optionProps}
      className={`relative flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-2 border-2 p-2 ${look.slot} ${slot.frame}`}
    >
      {CORNER_MARKS.map((place) => (
        <span key={place} className={`absolute h-3 w-3 ${place} ${slot.corner}`} aria-hidden="true" />
      ))}
      <ItemIcon profession={option.id} className="h-10 w-10 sm:h-12 sm:w-12" />
      <span className={`max-w-full text-center text-sm leading-tight [overflow-wrap:anywhere] ${slot.label}`} aria-hidden="true">
        {option.label}
      </span>
    </button>
  )
}

export function Inventory({ profession }: { profession: Profession }) {
  const { navigation, professions, hud } = useLabels()

  return (
    <section className={`mt-6 p-4 sm:p-6 ${look.panel}`} aria-label={navigation.professionSelection}>
      <div className="mb-4 flex items-center gap-4 border border-[color:var(--sh-sepia)] bg-[color:var(--sh-shadow)] p-3">
        <ItemIcon profession={profession} className="h-14 w-14 shrink-0" />
        <div className="min-w-0">
          <p className={`text-sm uppercase text-[color:var(--sh-brass-text)] ${look.typed}`}>{hud.equipped}</p>
          <p className="text-base text-[color:var(--sh-ivory)]">{professions[profession]}</p>
        </div>
      </div>
      <ProfessionSwitch className="grid grid-cols-3 gap-2 sm:gap-3" label={navigation.profession} renderOption={(option) => <ItemSlot option={option} />} />
    </section>
  )
}
