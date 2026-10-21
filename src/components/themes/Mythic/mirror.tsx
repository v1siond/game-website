'use client'

import { useEffect, useRef, useState } from 'react'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { SpartanSprite } from './sprite'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { Zone } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The profession switch as the mirror in his chamber: a tall gilded mirror with his reflection in it and
// three talent plates beside it, each showing him in that profession's kit. Picking one (click, or the
// arrow keys the shared switch handles) swirls darkness over the glass, the reflection comes back in the
// new kit, and the picked plate turns over to its lit gold face. The first render shows him as he is, so
// the mirror never swirls on page load.

// A new take each time the shown profession changes after the first render.
function useTakeOnChange(profession: Profession): number {
  const [take, setTake] = useState(0)
  const shown = useRef(profession)

  useEffect(() => {
    if (shown.current === profession) return
    shown.current = profession
    setTake((count) => count + 1)
  }, [profession])

  return take
}

function TalentPlate({ id, label, optionProps, turned }: ProfessionOption & { turned: boolean }) {
  return (
    <div {...optionProps} data-turned={turned || undefined} className={`flex flex-col items-center gap-2 px-2 pb-3 pt-2 ${u.talent}`}>
      <SpartanSprite profession={id} motion="still" className="h-24 w-20" />
      <span className={`text-center text-sm ${u.display}`}>{label}</span>
    </div>
  )
}

export function Mirror({ profession }: { profession: Profession }) {
  const { navigation, myth } = useLabels()
  const take = useTakeOnChange(profession)
  const { ref } = useZoneStage<Zone>('hall')

  return (
    <section ref={ref} className="relative z-20 px-4 py-12 sm:px-6" aria-label={navigation.professionSelection}>
      <div className={`mx-auto grid max-w-5xl items-center gap-8 p-5 sm:p-8 md:grid-cols-[auto_minmax(0,1fr)] ${u.panel}`}>
        <div className={`relative mx-auto w-44 ${u.mirrorFrame}`} aria-hidden="true">
          <div className={`relative h-64 overflow-hidden ${u.glass}`}>
            <div key={`r${take}`} data-take={take || undefined} className={`absolute inset-x-0 bottom-2 top-6 ${u.reflection}`}>
              <SpartanSprite profession={profession} motion="idle" className="h-full w-full" />
            </div>
            <svg key={`s${take}`} data-take={take || undefined} viewBox="0 0 100 100" className={`absolute inset-0 h-full w-full ${u.swirl}`}>
              <path d="M50 50 m-40 0 a40 40 0 1 1 80 0 a30 30 0 1 1 -60 0 a20 20 0 1 1 40 0 a10 10 0 1 1 -20 0" fill="none" stroke={MYTH.darkness} strokeWidth={10} strokeLinecap="round" />
              <circle cx={50} cy={50} r={22} fill={MYTH.darknessDeep} />
            </svg>
          </div>
        </div>

        <div className="min-w-0">
          <p className={`mb-4 text-2xl text-[var(--myth-gold)] sm:text-3xl ${u.display}`}>{navigation.selectYourProfession}</p>
          <ProfessionSwitch
            className="grid grid-cols-3 gap-3"
            label={navigation.profession}
            renderOption={(option) => <TalentPlate {...option} turned={take > 0} />}
          />
          <p className={`mt-5 ${u.hint}`}>{myth.mirrorHint}</p>
        </div>
      </div>
    </section>
  )
}
