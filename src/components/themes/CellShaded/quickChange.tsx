'use client'

import { useEffect, useRef, useState } from 'react'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { VaultSprite } from './sprite'
import { Digistruct } from './digistruct'
import { HATCH } from './ink'
import { CEL } from './palette'
import { useStage } from './stage'
import cel from './cel.module.css'

// The profession switch as the wasteland's quick change station: a booth with a glowing pad and three
// outfit tabs, each showing him in that profession's gear. Picking one (click, or the arrow keys the
// shared switch handles) rebuilds him on the pad slice by slice in the new outfit; the first render
// shows him whole, so the station never builds on page load.

function OutfitTab({ id, label, selected, optionProps }: ProfessionOption) {
  return (
    <div
      {...optionProps}
      className={`flex min-h-[44px] cursor-pointer flex-col items-center gap-2 border-4 border-[var(--cel-ink)] px-3 pb-3 pt-2 shadow-[4px_4px_0_var(--cel-ink)] ${cel.outfit} ${
        selected ? 'bg-[var(--cel-sun)]' : 'bg-[var(--cel-paper)]'
      }`}
    >
      <VaultSprite profession={id} motion="still" className="h-24 w-14" />
      <span className={`text-base ${cel.display} [-webkit-text-stroke:0]`}>{label}</span>
    </div>
  )
}

// A new build each time the shown profession changes after the first render.
function useBuildOnChange(profession: Profession): number {
  const [build, setBuild] = useState(0)
  const shown = useRef(profession)

  useEffect(() => {
    if (shown.current === profession) return
    shown.current = profession
    setBuild((count) => count + 1)
  }, [profession])

  return build
}

export function QuickChange({ profession }: { profession: Profession }) {
  const { navigation, hud } = useLabels()
  const build = useBuildOnChange(profession)
  const { ref } = useStage('noon')

  return (
    <section ref={ref} className="relative z-20 px-4 py-10 sm:px-6" aria-label={navigation.professionSelection}>
      <div className={`mx-auto grid max-w-5xl items-center gap-6 p-5 sm:p-8 md:grid-cols-[auto_minmax(0,1fr)] ${cel.darkPaper}`}>
        <div className="relative mx-auto h-64 w-44" aria-hidden="true">
          {/* the booth: its frame inked and hatched, the pad glowing under him */}
          <svg viewBox="0 0 176 256" className={`absolute inset-0 h-full w-full ${cel.inked}`}>
            <path d="M14 20 L162 20 L162 240 L14 240 Z" fill={CEL.steelDark} />
            <path d="M130 20 L162 20 L162 240 L130 240 Z" fill={HATCH} opacity={0.5} data-bare />
            <path d="M28 34 L148 34 L148 214 L28 214 Z" fill={CEL.night} />
            <path d="M6 8 L170 8 L170 26 L6 26 Z" fill={CEL.orange} />
          </svg>
          <svg viewBox="0 0 176 40" className={`absolute inset-x-0 bottom-2 h-10 w-full ${cel.padGlow}`}>
            <ellipse cx={88} cy={20} rx={70} ry={12} fill={CEL.holo} stroke={CEL.ink} strokeWidth={3} />
          </svg>
          <Digistruct profession={profession} build={build} className="absolute bottom-6 left-1/2 h-48 w-28 -translate-x-1/2" />
        </div>

        <div className="min-w-0">
          <p className={`mb-4 text-2xl text-[var(--cel-sun)] sm:text-3xl ${cel.display}`}>{navigation.selectYourProfession}</p>
          <ProfessionSwitch
            className="grid grid-cols-3 gap-3"
            label={navigation.profession}
            renderOption={(option) => <OutfitTab {...option} />}
          />
          <p className="mt-4 text-base text-[var(--cel-paper)]">{hud.changeHint}</p>
        </div>
      </div>
    </section>
  )
}
