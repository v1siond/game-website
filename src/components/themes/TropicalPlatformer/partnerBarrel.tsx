'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { PROFESSION_ORDER, type Profession } from '@/lib/cv/professions'
import { BarrelArt } from './barrel'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import { DuskStage } from './scenery'
import look from './jungle.module.css'
import partner from './partnerBarrel.module.css'

// The profession switch as the partner barrel: one big barrel on a jungle ledge, rocking now and then
// because someone is inside, with a band of insignia round its middle. The three plates beside it are
// the shared ProfessionSwitch radiogroup (arrows, Tab and the names come from it). A pick turns the band
// to the picked insignia, the barrel bursts into staves and he pops out of it in that costume onto the
// ledge, where he does that profession's action (typing, drumming, jabbing), while the one he was runs
// off the ledge.
//
// Pattern: keyed remount per pick (the key is the profession) for the burst and the pop; the runner is
// the previous profession, remembered by adjusting state during render (React's documented way to keep
// the value of the render before), so it needs no effect. The first pop plays when the ledge scrolls in
// (data-on from the shared trigger).

// Each profession's insignia, drawn in a 40 by 40 box in the ink given.
const INSIGNIA: Record<Profession, (ink: string) => ReactNode> = {
  engineer: (ink) => (
    <path
      d="M27 6 a8 8 0 0 0 -8 10 L7 28 a3.5 3.5 0 0 0 5 5 L24 21 a8 8 0 0 0 10 -8 l-5 5 -5 -1 -1 -5 Z"
      fill={ink}
    />
  ),
  drummer: (ink) => (
    <>
      <ellipse cx="20" cy="24" rx="13" ry="5" fill="none" stroke={ink} strokeWidth="2.5" />
      <path d="M7 24 V31 Q20 38 33 31 V24" fill="none" stroke={ink} strokeWidth="2.5" />
      <path d="M11 4 L19 20 M29 4 L21 20" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  fighter: (ink) => (
    <>
      <path d="M11 15 Q11 6 20 6 Q30 6 30 16 V25 Q30 32 22 32 H16 Q10 32 10 26 Z" fill={ink} />
      <path d="M11 35 H29" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
}

// The staves the barrel bursts into: each flies out along its own angle.
const STAVES = [-70, -40, -12, 14, 42, 72]

function InsigniaBand({ active }: { active: Profession }) {
  return (
    <div className="absolute left-[14%] top-[37%] h-[22%] w-[72%] overflow-hidden rounded-md border-2 border-[color:var(--tp-bark-dark)] bg-[color:var(--tp-bark-dark)]" aria-hidden="true">
      <div className={`flex h-full w-[300%] ${partner.band}`} style={{ '--slot': PROFESSION_ORDER.indexOf(active) } as CSSProperties}>
        {PROFESSION_ORDER.map((id) => (
          <svg key={id} viewBox="0 0 40 40" className="h-full w-1/3 py-1" focusable="false">
            {INSIGNIA[id](C.sunGold)}
          </svg>
        ))}
      </div>
    </div>
  )
}

function BarrelStage() {
  const { active } = useProfession()
  const [cast, setCast] = useState<{ lead: Profession; leaving: Profession | null }>({ lead: active, leaving: null })
  if (cast.lead !== active) setCast({ lead: active, leaving: cast.lead })

  return (
    <div className={`relative h-72 overflow-hidden rounded-[2rem] border-4 border-[color:var(--tp-bark-dark)] sm:h-80 ${partner.stage}`} aria-hidden="true">
      <DuskStage />
      <div className={`absolute inset-x-0 bottom-0 h-12 ${partner.ledge}`} />

      {cast.leaving && (
        <div key={`${cast.leaving}-${active}`} className={`absolute bottom-10 left-[8%] h-40 w-28 ${partner.runner}`}>
          <HeroCharacter profession={cast.leaving} pose="run" className="h-full w-full" />
        </div>
      )}

      <div key={active} className="absolute inset-0">
        <div className={`absolute bottom-10 left-[8%] h-40 w-28 ${partner.pop}`}>
          <HeroCharacter profession={active} pose="act" className="h-full w-full" />
        </div>
        <div className={`absolute bottom-10 left-[56%] w-32 sm:w-36 ${partner.rock}`}>
          <div className={`relative ${partner.burst}`}>
            <BarrelArt mark="plain" className="block h-auto w-full" />
            <InsigniaBand active={active} />
          </div>
          {STAVES.map((angle) => (
            <span key={angle} className={`absolute left-1/2 top-1/3 block h-14 w-4 rounded-md ${partner.stave}`} style={{ '--a': `${angle}deg` } as CSSProperties} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Plate({ id, label, selected, optionProps }: ProfessionOption) {
  const { professionFields } = useLabels()

  return (
    <button
      type="button"
      {...optionProps}
      data-selected={selected || undefined}
      className={`flex min-h-[44px] w-full items-center gap-4 rounded-2xl px-4 py-3 text-left ${look.focus} ${partner.plate}`}
    >
      <svg viewBox="0 0 40 40" className="h-10 w-10 flex-shrink-0" aria-hidden="true" focusable="false">
        {INSIGNIA[id](selected ? C.barkDark : C.sunGold)}
      </svg>
      <span className="min-w-0 flex-1">
        <span className={`block text-lg uppercase ${look.display}`}>{label}</span>
        <span className="block text-sm">{professionFields[id]}</span>
      </span>
      <svg viewBox="0 0 24 24" className={`h-7 w-7 flex-shrink-0 ${partner.check}`} aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="11" fill={C.barkDark} />
        <path d="M6.5 12.5 L10.5 16.5 L17.5 8" fill="none" stroke={C.sunGold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

export function PartnerBarrel() {
  const { navigation } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })

  return (
    <div ref={ref} data-on={triggered || undefined} className={`mx-auto max-w-5xl ${partner.root}`}>
      <p className={`mx-auto mb-8 w-fit rounded-xl px-6 py-3 text-center text-xl uppercase text-[color:var(--tp-sun-gold)] ${look.plank} ${look.display} ${look.outlined}`}>
        {navigation.selectYourProfession}
      </p>
      <div className="grid items-center gap-6 sm:grid-cols-2 sm:gap-10">
        <BarrelStage />
        <ProfessionSwitch className="flex flex-col gap-4" label={navigation.profession} renderOption={(option) => <Plate {...option} />} />
      </div>
    </div>
  )
}
