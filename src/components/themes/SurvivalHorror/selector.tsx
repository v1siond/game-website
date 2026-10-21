import type { ReactNode } from 'react'
import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { SH } from './palette'
import { CORNER_MARKS } from './panels'
import look from './world.module.css'

// One slot of the item box, the shared profession switch drawn as the save room's inventory: each
// profession is an item in its slot (a floppy disk, a pair of drumsticks, a wrapped glove), the picked
// one under the lamp's light with its corner marks lit. ProfessionSwitch owns the order, the pick and
// the keyboard; the slot only draws itself.

const ITEM: Record<Profession, ReactNode> = {
  engineer: (
    <>
      <path d="M8 6 H34 L40 12 V40 H8 Z" fill={SH.steel} stroke={SH.void} strokeWidth={1} />
      <rect x={14} y={6} width={16} height={11} fill={SH.ash} />
      <rect x={24} y={8} width={4} height={7} fill={SH.void} />
      <rect x={12} y={24} width={24} height={14} fill={SH.cream} />
      <path d="M15 29 H33 M15 33 H29" stroke={SH.wood} strokeWidth={1} />
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
      <rect x={14} y={30} width={18} height={10} fill={SH.cream} />
      <path d="M14 33 H32 M14 37 H32" stroke={SH.ash} strokeWidth={0.8} />
      <path d="M12 30 Q8 12 22 8 Q36 6 37 18 Q38 28 34 30 Z" fill={SH.leather} stroke={SH.void} strokeWidth={1} />
      <path d="M12 22 Q6 22 8 16 Q10 12 14 15" fill={SH.leather} stroke={SH.void} strokeWidth={1} />
    </>
  ),
}

const SLOT_LOOK = {
  on: { frame: 'border-[color:var(--sh-flame)]', corner: 'border-[color:var(--sh-flame)]', label: 'text-[color:var(--sh-ivory)]' },
  off: { frame: 'border-[color:var(--sh-wood)] hover:border-[color:var(--sh-brass)]', corner: 'border-[color:var(--sh-brass)]', label: 'text-[color:var(--sh-cream)]' },
}

export function ItemSlot({ option: { id, label, selected, optionProps } }: { option: ProfessionOption }) {
  const slot = SLOT_LOOK[selected ? 'on' : 'off']

  return (
    <button type="button" {...optionProps} className={`relative flex aspect-square flex-col items-center justify-center gap-2 border-2 p-2 ${look.slot} ${look.focus} ${slot.frame}`}>
      {CORNER_MARKS.map((place) => (
        <span key={place} className={`absolute h-3 w-3 ${place} ${slot.corner}`} aria-hidden="true" />
      ))}
      <svg viewBox="0 0 48 48" className="h-10 w-10 sm:h-14 sm:w-14" aria-hidden="true" focusable="false">
        {ITEM[id]}
      </svg>
      <span className={`text-center text-sm leading-tight ${slot.label}`} aria-hidden="true">
        {label}
      </span>
    </button>
  )
}
