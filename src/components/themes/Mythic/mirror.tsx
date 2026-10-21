'use client'

import { useEffect, useRef, useState, type ReactElement } from 'react'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { SpartanSprite } from './sprite'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { Zone } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The profession switch as the mirror in his chamber: a tall gilded mirror with his reflection in it and
// three talent plates beside it, each carved with that profession's kit (the twin blades, the war drum,
// the wrapped fists under the mongkhon), so he is drawn once, in the glass. Picking one (click, or the
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

const INK = MYTH.inkLine

function TwinBlades() {
  return (
    <>
      <path d="M10 40 L16 36 L36 8 L32 6 Z M38 40 L32 36 L14 6 L18 4 Z" fill={MYTH.steel} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M6 42 Q12 30 10 40 M42 42 Q36 30 38 40" fill="none" stroke={MYTH.bladeFire} strokeWidth={2} />
      <path d="M8 42 L14 36 M40 42 L34 36" stroke={MYTH.bronze} strokeWidth={4} strokeLinecap="round" />
    </>
  )
}

function WarDrumMark() {
  return (
    <>
      <path d="M8 16 L40 16 L37 42 L11 42 Z" fill={MYTH.leather} stroke={INK} strokeWidth={2} />
      <path d="M10 20 L24 40 L38 20 M12 40 L24 20 L36 40" fill="none" stroke={MYTH.bone} strokeWidth={1.2} />
      <ellipse cx={24} cy={16} rx={17} ry={5} fill={MYTH.bone} stroke={INK} strokeWidth={2} />
      <path d="M14 4 L22 14 M34 4 L26 14" stroke={MYTH.bronze} strokeWidth={3} strokeLinecap="round" />
    </>
  )
}

function WrappedFists() {
  return (
    <>
      <path d="M8 12 Q24 2 40 12" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M8 12 Q24 2 40 12" fill="none" stroke={MYTH.tattoo} strokeWidth={3.6} strokeLinecap="round" />
      <path d="M6 22 Q14 17 22 22 L22 36 Q14 41 6 36 Z M26 22 Q34 17 42 22 L42 36 Q34 41 26 36 Z" fill={MYTH.wrap} stroke={INK} strokeWidth={2} />
      <path d="M7 27 L21 29 M7 31 L21 33 M27 27 L41 29 M27 31 L41 33" stroke={MYTH.boneShade} strokeWidth={1.2} />
    </>
  )
}

// The mark carved on each talent plate: the kit of that profession.
const KIT_MARK: Record<Profession, () => ReactElement> = {
  engineer: TwinBlades,
  drummer: WarDrumMark,
  fighter: WrappedFists,
}

function TalentPlate({ id, label, optionProps, turned }: ProfessionOption & { turned: boolean }) {
  const Mark = KIT_MARK[id]
  return (
    <div {...optionProps} data-turned={turned || undefined} className={`flex items-center gap-3 px-3 py-2 sm:flex-col sm:gap-2 sm:px-2 sm:pb-3 sm:pt-2 ${u.talent}`}>
      <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" aria-hidden="true">
        <Mark />
      </svg>
      <span className={`min-w-0 text-sm sm:text-center ${u.display}`}>{label}</span>
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
            className="grid gap-3 sm:grid-cols-3"
            label={navigation.profession}
            renderOption={(option) => <TalentPlate {...option} turned={take > 0} />}
          />
          <p className={`mt-5 ${u.hint}`}>{myth.mirrorHint}</p>
        </div>
      </div>
    </section>
  )
}
