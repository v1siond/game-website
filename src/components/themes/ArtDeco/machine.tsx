'use client'

import { Fragment, type ReactNode } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Profession } from '@/lib/cv/professions'
import { GlassSurvivor } from './survivor'
import { DECO_COLORS as C } from './palette'
import machine from './machine.module.css'

// The profession switch as the city's vending machine: a stepped brass crown with its marquee, a glass
// case showing him in the picked profession's costume beside that profession's own prop, the item rows
// (each profession with its field on the price tag) and the tray at the foot.
//
// A pick vends: the roller blind drops over the glass and lifts again on him in the new costume, the
// tonic bottle of that profession drops into the tray and the marquee bulbs chase. Pattern: CSS only,
// one keyed remount per pick (the key is the profession), every step a keyframe delay; the first one
// plays when the machine scrolls into view (data-on from the shared trigger). The rows are the shared
// ProfessionSwitch radiogroup, so arrows, Tab and the accessible names come from it.

// The glyph on each profession's bottle and row, in the ink it is drawn in.
const GLYPHS: Record<Profession, (ink: string) => ReactNode> = {
  engineer: (ink) => <path d="M20 5 L25 18 L32 18 L18 35 L22 22 L15 22 Z" fill={ink} />,
  drummer: (ink) => (
    <>
      <ellipse cx="20" cy="24" rx="12" ry="5" fill="none" stroke={ink} strokeWidth="2" />
      <path d="M8 24 V30 Q20 36 32 30 V24" fill="none" stroke={ink} strokeWidth="2" />
      <path d="M12 6 L19 20 M28 6 L21 20" stroke={ink} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  fighter: (ink) => (
    <>
      <path d="M12 14 Q12 6 20 6 Q29 6 29 15 V24 Q29 31 21 31 H16 Q11 31 11 25 Z" fill={ink} />
      <path d="M12 33 H28" stroke={ink} strokeWidth="3" />
    </>
  ),
}

// The prop that stands in the glass with him, one per profession, in a 120 by 120 box.
const PROPS: Record<Profession, ReactNode> = {
  engineer: (
    <>
      <path d="M8 120 V60 H18 V50 H102 V60 H112 V120 Z" fill="#14324a" stroke={C.brassMid} strokeWidth="2" />
      <rect x="24" y="62" width="72" height="30" fill={C.abyss} stroke={C.gold} strokeWidth="1.5" />
      <path d="M30 72 H62 M30 80 H80 M30 88 H54" stroke={C.waterGlow} strokeWidth="2" />
      {[34, 60, 86].map((x) => (
        <g key={x}>
          <circle cx={x} cy="106" r="7" fill={C.cream} stroke={C.brassDark} strokeWidth="2" />
          <path d={`M${x} 106 L${x + 4} 101`} stroke={C.blood} strokeWidth="1.5" />
        </g>
      ))}
    </>
  ),
  drummer: (
    <>
      <circle cx="60" cy="86" r="32" fill={C.cream} stroke={C.brassMid} strokeWidth="4" />
      {[-60, -30, 0, 30, 60].map((angle) => (
        <path key={angle} d="M60 104 L60 62" stroke={C.gold} strokeWidth="2" transform={`rotate(${angle} 60 104)`} />
      ))}
      <circle cx="60" cy="104" r="8" fill={C.blood} />
      <path d="M14 40 H44 M76 34 H108" stroke={C.goldBright} strokeWidth="3" />
      <path d="M29 40 V120 M92 34 V120" stroke={C.brassDark} strokeWidth="2" />
    </>
  ),
  fighter: (
    <>
      <path d="M60 0 V18" stroke={C.brassDark} strokeWidth="2" />
      <rect x="40" y="18" width="40" height="84" rx="14" fill={C.blood} stroke={C.bloodDark} strokeWidth="2" />
      <path d="M40 40 H80 M40 80 H80" stroke={C.gold} strokeWidth="3" />
      <path d="M0 116 H120" stroke={C.gold} strokeWidth="3" />
    </>
  ),
}

// The machine's crown: three steps up to a sunburst, gold on brass.
function Crown() {
  return (
    <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="absolute inset-x-0 bottom-full h-14 w-full sm:h-16" aria-hidden="true" focusable="false">
      <path d="M0 70 V50 H60 V34 H120 V18 H280 V34 H340 V50 H400 V70 Z" fill={C.brassDark} stroke={C.gold} strokeWidth="2" />
      {[-60, -40, -20, 0, 20, 40, 60].map((angle) => (
        <path key={angle} d="M200 70 L200 24" stroke={C.goldBright} strokeWidth="2" opacity="0.6" transform={`rotate(${angle} 200 70)`} />
      ))}
      <circle cx="200" cy="70" r="16" fill={C.gold} />
    </svg>
  )
}

function ItemRow({ id, label, selected, optionProps }: ProfessionOption) {
  const { professionFields } = useLabels()
  const ink = selected ? C.abyss : C.gold

  return (
    <button type="button" {...optionProps} className={`group flex w-full items-center gap-4 px-4 py-3 text-left ${machine.row}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 flex-shrink-0" aria-hidden="true" focusable="false">
        {GLYPHS[id](ink)}
      </svg>
      {/* the field tag sits under the name until the row is wide enough (768px) to hold both on one line */}
      <span className="flex min-w-0 flex-1 flex-col items-start gap-1 md:flex-row md:items-center md:gap-4">
        <span className={`min-w-0 text-base uppercase tracking-[0.12em] md:flex-1 ${machine.rowTitle}`}>{label}</span>
        <span className={`px-2 py-1 text-sm md:flex-shrink-0 ${machine.tag}`}>{professionFields[id]}</span>
      </span>
      <svg viewBox="0 0 12 16" className={`h-4 w-3 flex-shrink-0 ${machine.pick}`} aria-hidden="true" focusable="false">
        <path d="M0 0 L12 8 L0 16 Z" fill={ink} />
      </svg>
    </button>
  )
}

export function VendingMachine() {
  const { active } = useProfession()
  const { navigation } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })

  return (
    <div ref={ref} data-on={triggered || undefined} className={`relative mx-auto mt-16 max-w-4xl ${machine.machine}`}>
      <Crown />
      <div className={`relative border-[3px] border-[color:var(--deco-gold)] px-4 pb-5 pt-4 sm:px-8 sm:pb-8 ${machine.cabinet}`}>
        <div className="relative mb-5 overflow-hidden border-2 border-[color:var(--deco-brass-dark)] bg-[color:var(--deco-blood-dark)] px-4 py-3 text-center">
          <Fragment key={active}>
            <span className={`pointer-events-none absolute inset-0 ${machine.bulbs} ${machine.bulbsOdd}`} aria-hidden="true" />
            <span className={`pointer-events-none absolute inset-0 ${machine.bulbs} ${machine.bulbsEven}`} aria-hidden="true" />
          </Fragment>
          <p className={`relative text-base uppercase tracking-[0.3em] ${machine.marquee}`}>{navigation.selectYourProfession}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className={`relative h-64 overflow-hidden rounded-t-[7rem] border-[3px] border-[color:var(--deco-brass-mid)] sm:h-72 ${machine.glass}`}>
            <Fragment key={active}>
              <svg viewBox="0 0 120 120" className={`absolute bottom-6 right-2 h-28 w-28 ${machine.prop}`} aria-hidden="true" focusable="false">
                {PROPS[active]}
              </svg>
              <div className={`absolute bottom-6 left-[18%] h-44 w-28 sm:h-52 sm:w-32 ${machine.figure}`}>
                <GlassSurvivor profession={active} className="h-full w-full" />
              </div>
              <div className={`pointer-events-none absolute inset-0 ${machine.blind}`} aria-hidden="true" />
            </Fragment>
            <div className="absolute inset-x-0 bottom-0 h-6 border-t-2 border-[color:var(--deco-gold)] bg-[color:var(--deco-brass-dark)]" aria-hidden="true" />
            <div className={`pointer-events-none absolute inset-0 ${machine.shine}`} aria-hidden="true" />
          </div>

          <div className="flex flex-col justify-between gap-5">
            <ProfessionSwitch className="flex flex-col gap-3" label={navigation.profession} renderOption={(option) => <ItemRow {...option} />} />

            <div className="flex items-end gap-4" aria-hidden="true">
              <div className="h-14 w-3 rounded-full border-2 border-[color:var(--deco-gold)] bg-[color:var(--deco-abyss)]" />
              <div className={`relative h-16 flex-1 overflow-hidden border-2 border-[color:var(--deco-gold)] ${machine.tray}`}>
                <span key={active} className="absolute bottom-1 left-1/2 block -translate-x-1/2">
                  <svg viewBox="0 0 40 60" className={`block h-12 w-8 ${machine.bottle}`} focusable="false">
                    <path d="M15 2 H25 V14 Q34 20 34 30 V56 Q34 58 32 58 H8 Q6 58 6 56 V30 Q6 20 15 14 Z" fill={C.goldBright} stroke={C.brassDark} strokeWidth="2" />
                    <g transform="translate(8 22) scale(0.6)">{GLYPHS[active](C.abyss)}</g>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
