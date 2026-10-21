'use client'

import { useState } from 'react'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import { PROFESSION_ORDER, type Profession } from '@/lib/cv/professions'
import { Fighter } from './fighter'
import { ArenaFighter } from './arena'
import { StageBackdrop } from './stages'
import { CallText, RoundCall } from './badges'
import { HudCentre, LifeBar } from './hud'
import { WorldMap } from './worldMap'
import { FS } from './palette'
import look from './world.module.css'
import fight from './fight.module.css'

// The select screen, drawn like the early 90s arcade select: the world map with his home pin across the
// top, square portraits in thin frames under it, each with its name on a black plate, and the preview
// below as a fight screen with its HUD (the two life bars, the KO badge over the clock). The shared
// ProfessionSwitch owns the pick and the keys; this draws the grid.
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
      <span className={`relative flex h-24 w-full items-end justify-center overflow-hidden border-2 sm:h-36 ${look.portrait} ${selected ? look.portraitPicked : look.portraitOpen}`} aria-hidden="true">
        <Fighter profession={id} pose="stance" still={!aimed} className="relative h-24 w-[5.75rem] sm:h-36 sm:w-[8.5rem]" />
        {selected && <span key={id} className={`absolute inset-0 bg-white opacity-0 ${fight.pickFlash}`} />}
      </span>
      <span className={`mt-2 w-full border-2 border-black px-1 py-1 text-center text-sm uppercase leading-tight shadow-[2px_2px_0_#000] ${look.display} ${selected ? 'bg-[color:var(--fs-p1-light)] text-[color:var(--fs-ink)]' : 'bg-black text-white'}`}>
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
      <div className="relative mb-4 h-28 overflow-hidden border-2 border-white shadow-[0_0_0_2px_#000] sm:h-40">
        <WorldMap />
      </div>

      <div className="relative" onPointerLeave={() => setAim(null)}>
        <ProfessionSwitch
          className="grid grid-cols-3"
          label={navigation.profession}
          renderOption={(option) => <Slot {...option} aimed={option.id === aimed} onAim={setAim} />}
        />
        <div className={`pointer-events-none absolute inset-y-0 left-0 w-1/3 ${fight.cursor} ${SLOT_VAR[slot]}`} aria-hidden="true">
          <div className="absolute inset-x-0 bottom-9 top-1 border-4 border-[color:var(--fs-p1-light)] shadow-[0_0_0_2px_#000] sm:inset-x-1" />
          <span className={`absolute -top-3 left-1/2 flex -translate-x-1/2 flex-col items-center ${look.display}`}>
            <span className="border-2 border-black bg-[color:var(--fs-p1-light)] px-2 text-sm leading-5 text-[color:var(--fs-ink)]">{hud.playerOne}</span>
            <svg viewBox="0 0 20 10" className="h-2 w-5" focusable="false">
              <path d="M0 0 H20 L10 10 Z" fill={FS.p1Light} />
            </svg>
          </span>
        </div>
      </div>

      <div key={active} className="relative mt-6 h-56 overflow-hidden border-2 border-white shadow-[0_0_0_2px_#000] sm:h-72">
        <StageBackdrop profession={active} />
        <div className="pointer-events-none absolute inset-x-2 top-2 z-20 flex items-start gap-2 sm:inset-x-4 sm:top-3" aria-hidden="true">
          <LifeBar side="p1" label={hud.playerOne} />
          <HudCentre>
            <span className="text-3xl leading-none">
              <CallText>99</CallText>
            </span>
          </HudCentre>
          <LifeBar side="p2" label="?" />
        </div>
        <ArenaFighter
          profession={active}
          rest="act"
          intro="walk"
          className={`absolute bottom-0 left-[6%] ${fight.previewIn}`}
          spriteClass="h-44 w-[10.25rem] sm:h-60 sm:w-[14rem]"
        />
        <div className={`absolute inset-x-0 top-[38%] ${fight.callIn}`}>
          <RoundCall text={title} />
        </div>
      </div>
    </div>
  )
}
