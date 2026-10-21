'use client'

import { useState } from 'react'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import { PROFESSION_ORDER, type Profession } from '@/lib/cv/professions'
import { HeroCharacter } from './character'
import { StageBackdrop } from './stages'
import { RoundCall } from './badges'
import { FS } from './palette'
import look from './world.module.css'
import fight from './fight.module.css'

// The select screen. The shared ProfessionSwitch owns the pick and the keys; this draws the grid.
// The player one cursor is one frame in player one's blue, carrying its 1P tag, that snaps (steps) to
// the slot under the pointer or focus and returns to the pick when the pointer leaves, like a cursor
// roaming the roster. The fighter under the cursor idles in his stance while he is weighed up. A pick
// flashes its slot white and re-runs the preview below: the stage, him landing in his stance and the
// profession title slammed across it (keyed by the pick, so each pick plays it again).

// Static classes so Tailwind sees each one; the cursor reads --slot.
const SLOT_VAR = ['[--slot:0]', '[--slot:1]', '[--slot:2]']

interface SlotProps extends ProfessionOption {
  aimed: boolean
  onAim: (id: Profession) => void
}

function Slot({ id, label, selected, optionProps, aimed, onAim }: SlotProps) {
  return (
    <button
      type="button"
      {...optionProps}
      onPointerEnter={() => onAim(id)}
      onFocus={() => onAim(id)}
      className={`relative flex flex-col items-center px-1 pb-2 pt-3 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fs-gold)] sm:px-3 ${fight.press}`}
    >
      <span className={`relative flex h-24 w-full items-end justify-center overflow-hidden border-4 sm:h-36 ${look.portrait} ${selected ? look.portraitPicked : look.portraitOpen}`} aria-hidden="true">
        <HeroCharacter profession={id} className={`relative h-20 w-14 sm:h-32 sm:w-24 ${aimed ? fight.stance : ''}`} />
        {selected && <span key={id} className={`absolute inset-0 bg-white opacity-0 ${fight.pickFlash}`} />}
      </span>
      <span className={`mt-2 w-full px-2 py-1.5 text-center text-sm uppercase ${look.display} ${look.nameplate} ${selected ? 'bg-[color:var(--fs-p1-light)] text-[color:var(--fs-ink)]' : 'bg-[color:var(--fs-steel)] text-white'}`}>
        {label}
      </span>
    </button>
  )
}

export function SelectScreen({ active, title }: { active: Profession; title: string }) {
  const [aim, setAim] = useState<Profession | null>(null)
  const { hud, navigation } = useLabels()
  const aimed = aim ?? active
  const slot = PROFESSION_ORDER.indexOf(aimed)

  return (
    <div>
      <div className="relative" onPointerLeave={() => setAim(null)}>
        <ProfessionSwitch
          className="grid grid-cols-3"
          label={navigation.profession}
          renderOption={(option) => <Slot {...option} aimed={option.id === aimed} onAim={setAim} />}
        />
        <div className={`pointer-events-none absolute inset-y-0 left-0 w-1/3 ${fight.cursor} ${SLOT_VAR[slot]}`} aria-hidden="true">
          <div className="absolute inset-x-0 bottom-9 top-1 border-4 border-[color:var(--fs-p1-light)] sm:inset-x-1" />
          <span className={`absolute -top-3 left-1/2 flex -translate-x-1/2 flex-col items-center ${look.display}`}>
            <span className="bg-[color:var(--fs-p1-light)] px-2 text-sm leading-5 text-[color:var(--fs-ink)]">{hud.playerOne}</span>
            <svg viewBox="0 0 20 10" className="h-2 w-5" focusable="false">
              <path d="M0 0 H20 L10 10 Z" fill={FS.p1Light} />
            </svg>
          </span>
        </div>
      </div>

      <div key={active} className="relative mt-6 h-48 overflow-hidden border-4 border-[color:var(--fs-gold)] sm:h-64">
        <StageBackdrop profession={active} />
        <div className={`absolute bottom-2 left-[12%] ${fight.previewIn}`}>
          <HeroCharacter profession={active} className={`h-36 w-24 sm:h-52 sm:w-36 ${fight.stance}`} />
        </div>
        <div className={`absolute inset-x-0 top-1/3 ${fight.callIn}`}>
          <RoundCall text={title} />
        </div>
      </div>
    </div>
  )
}
