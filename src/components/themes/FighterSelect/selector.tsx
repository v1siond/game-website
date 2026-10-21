import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { HeroCharacter } from './character'
import { FS } from './palette'
import look from './world.module.css'

// One slot of the select grid: him in that profession's costume, standing in a slanted portrait frame,
// the label on its nameplate. The picked slot glows player one blue and carries the bobbing P1 cursor.

const SLOT_LOOK = {
  picked: { frame: look.portraitPicked, plate: 'bg-[color:var(--fs-p1-light)] text-[color:var(--fs-ink)]', lift: 'z-10 scale-105' },
  open: { frame: look.portraitOpen, plate: 'bg-[color:var(--fs-steel)] text-white', lift: 'opacity-80 hover:opacity-100' },
}

export function FighterPortrait({ id, label, selected, optionProps }: ProfessionOption) {
  const slot = SLOT_LOOK[selected ? 'picked' : 'open']

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative flex w-full flex-col items-center px-2 pb-3 pt-6 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--fs-gold)] motion-safe:transition-transform sm:w-auto sm:min-w-[11rem] sm:px-5 ${slot.lift}`}
    >
      {selected && (
        <svg viewBox="0 0 20 14" className={`absolute -top-3 left-1/2 h-4 w-6 -translate-x-1/2 ${look.bob}`} aria-hidden="true" focusable="false">
          <path d="M0 0 H20 L10 14 Z" fill={FS.p1Light} stroke={FS.ink} strokeWidth={1.5} />
        </svg>
      )}
      <span className={`flex h-24 w-full items-end justify-center border-4 sm:h-32 ${look.portrait} ${slot.frame}`} aria-hidden="true">
        <HeroCharacter profession={id} className="h-20 w-14 sm:h-28 sm:w-20" />
      </span>
      <span className={`mt-2 w-full px-3 py-1.5 text-center text-sm uppercase ${look.display} ${look.nameplate} ${slot.plate}`}>{label}</span>
    </button>
  )
}
