'use client'

import { type ReactElement } from 'react'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { Zone } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The profession switch as the altar of his callings in the great hall: three bronze plates, each carved
// with that calling's kit (the sword and shield, the war drum, the wrapped fists under the mongkhon). Picking
// one (click, or the arrow keys the shared switch handles) turns the plate over to its lit gold face.

const INK = MYTH.inkLine

function SwordAndShield() {
  return (
    <>
      <circle cx={18} cy={28} r={14} fill={MYTH.bronze} stroke={INK} strokeWidth={2} />
      <circle cx={18} cy={28} r={3} fill={MYTH.gold} stroke={INK} strokeWidth={1.2} />
      <path d="M26 40 L29 42 L44 8 L41 6 Z" fill={MYTH.steel} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M22 36 L33 41" stroke={MYTH.bronze} strokeWidth={4} strokeLinecap="round" />
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
  engineer: SwordAndShield,
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
  const { ref } = useZoneStage<Zone>('hall')

  return (
    <section ref={ref} className="relative z-20 px-4 py-12 sm:px-6" aria-label={navigation.professionSelection}>
      <div className={`mx-auto max-w-5xl p-5 sm:p-8 ${u.panel}`}>
        <h2 className="sr-only">{navigation.selectYourProfession}</h2>
        <ProfessionSwitch className="grid gap-3 sm:grid-cols-3" label={navigation.profession} renderOption={(option) => <TalentPlate {...option} />} />
      </div>
    </section>
  )
}
