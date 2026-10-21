'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { ProfessionRoom } from './rooms'
import { ConditionMonitor } from './ecg'
import { useDoor } from './door'
import { SH } from './palette'
import { CORNER_MARKS } from './panels'
import horror from './horror.module.css'
import look from './world.module.css'

// The profession switch as the genre's inventory screen beside the item box: on the left the room he is in
// (./rooms), on the right his condition, the equipped item turning in the examine view, and three slots, one
// item per profession (his laptop, his sticks, his hand wraps). Taking another item goes through the door
// (./door) to its room. The arrow keys change the profession straight away (ProfessionSwitch), so a change
// that did not come from a click still gets the door. ProfessionSwitch owns the order, the pick and the
// keyboard; this draws the screen.
//
// Animated: the room's own parts, the equipped item's turn.

const ITEM: Record<Profession, ReactNode> = {
  engineer: (
    <>
      <path d="M8 30 H40 L44 38 H4 Z" fill={SH.steel} stroke={SH.void} strokeWidth={0.8} />
      <rect x={10} y={10} width={28} height={20} rx={1.5} fill={SH.gunmetal} stroke={SH.void} strokeWidth={0.8} />
      <rect x={12.5} y={12.5} width={23} height={15} fill={SH.monitor} />
      <path d="M15 17 H28 M15 21 H32 M15 25 H23" stroke={SH.fine} strokeWidth={1.2} />
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
      <path d="M13 20 H36 M12 26 H37 M13 32 H36" stroke={SH.furShade} strokeWidth={1} />
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

function ItemSlot({ option, onTake }: { option: ProfessionOption; onTake: () => void }) {
  const slot = SLOT_LOOK[option.selected ? 'on' : 'off']

  return (
    <button
      type="button"
      {...option.optionProps}
      onClick={onTake}
      className={`relative flex min-h-[44px] flex-col items-center justify-center gap-2 border-2 p-2 ${look.slot} ${look.focus} ${slot.frame}`}
    >
      {CORNER_MARKS.map((place) => (
        <span key={place} className={`absolute h-3 w-3 ${place} ${slot.corner}`} aria-hidden="true" />
      ))}
      <ItemIcon profession={option.id} className="h-10 w-10 sm:h-12 sm:w-12" />
      <span className={`text-center text-sm leading-tight ${slot.label}`} aria-hidden="true">
        {option.label}
      </span>
    </button>
  )
}

export function ItemBox() {
  const { active } = useProfession()
  const { navigation, professions, hud, horror: words } = useLabels()
  const door = useDoor()
  const shown = useRef(active)
  const taken = useRef(false)

  // A change that came from the keyboard, not a click: the door still plays over the new room.
  useLayoutEffect(() => {
    if (shown.current === active) return
    shown.current = active
    if (!taken.current) door()
    taken.current = false
  }, [active, door])

  const take = (option: ProfessionOption) => {
    if (option.selected) return
    door(() => {
      taken.current = true
      option.optionProps.onClick()
    })
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6" aria-label={navigation.professionSelection}>
      <div className={`grid gap-4 p-4 sm:p-6 lg:grid-cols-[3fr_2fr] ${look.panel}`}>
        <div className={`relative h-[34vh] min-h-[220px] max-h-[380px] overflow-hidden border-2 border-[color:var(--sh-sepia)] ${horror.cameraFrame}`}>
          <ProfessionRoom profession={active} />
        </div>

        <div className="flex flex-col gap-4">
          <ConditionMonitor condition="fine" />
          <div className="flex items-center gap-4 border border-[color:var(--sh-sepia)] bg-[color:var(--sh-shadow)] p-3">
            <div className={horror.examineStage} aria-hidden="true">
              <ItemIcon profession={active} className={`h-16 w-16 ${horror.examineTurn}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-sm uppercase text-[color:var(--sh-brass)] ${look.typed}`}>{hud.equipped}</p>
              <p className="text-base text-[color:var(--sh-ivory)]">{professions[active]}</p>
            </div>
          </div>
          <div>
            <p className={`mb-2 text-sm uppercase tracking-[0.2em] text-[color:var(--sh-brass)] ${look.typed}`}>{words.itemBox}</p>
            <ProfessionSwitch className="grid grid-cols-3 gap-3" label={navigation.profession} renderOption={(option) => <ItemSlot option={option} onTake={() => take(option)} />} />
            <p className="mt-3 text-sm italic text-[color:var(--sh-fog)]">{words.itemBoxHint}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
