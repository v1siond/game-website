'use client'

import { type ReactElement } from 'react'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { useZoneStage } from '@/hooks/useZoneStage'
import { ZONE_OF, type Zone } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The profession switch as the altar of his callings: three bronze rimmed stones, each carved with that
// calling's kit (his twin blades on their chains, the war drum, the wrapped fists under the mongkhon). Picking
// one (click, or the arrow keys the shared switch handles) turns the stone over to its gold lit face.

const INK = MYTH.inkLine

function TwinBlades() {
  return (
    <>
      <path d="M6 42 Q24 30 42 42" fill="none" stroke={MYTH.chain} strokeWidth={2} strokeDasharray="3 2" />
      <path d="M10 40 L14 36 L34 8 Q38 4 40 8 L18 40 Z" fill={MYTH.fire} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M38 40 L34 36 L14 8 Q10 4 8 8 L30 40 Z" fill={MYTH.bronzeLight} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M6 38 L16 44 M42 38 L32 44" stroke={MYTH.bronzeShade} strokeWidth={4} strokeLinecap="round" />
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
      <path d="M8 12 Q24 2 40 12" fill="none" stroke={MYTH.crest} strokeWidth={3.6} strokeLinecap="round" />
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

function TalentPlate({ id, label, optionProps }: ProfessionOption) {
  const Mark = KIT_MARK[id]
  return (
    <div {...optionProps} className={`flex items-center gap-3 px-3 py-2 sm:flex-col sm:gap-2 sm:px-2 sm:pb-3 sm:pt-2 ${u.talent}`}>
      <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" aria-hidden="true">
        <Mark />
      </svg>
      <span className={`min-w-0 text-sm sm:text-center ${u.display}`}>{label}</span>
    </div>
  )
}

export function Altar() {
  const { navigation } = useLabels()
  const { ref } = useZoneStage<Zone>(ZONE_OF.hero)

  // from lg the altar comes up only once the hero's scene has played (its first 0.6 of a screen of scroll,
  // src/lib/scroll/stage.ts), so the serpent's end frame is whole when the page first rests on it
  return (
    <section ref={ref} className="relative z-20 px-4 py-12 sm:px-6 lg:mt-[60svh]" aria-label={navigation.professionSelection}>
      <div className={`mx-auto max-w-5xl p-5 sm:p-8 ${u.panel}`}>
        <h2 className="sr-only">{navigation.selectYourProfession}</h2>
        <ProfessionSwitch className="grid gap-3 sm:grid-cols-3" label={navigation.profession} renderOption={(option) => <TalentPlate {...option} />} />
      </div>
    </section>
  )
}
