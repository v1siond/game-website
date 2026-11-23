'use client'

import { useState } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useOnChange } from '@/hooks/useOnChange'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLabels } from '@/components/cv/CVDataProvider'
import { DETECTIVE_HOST, Detective } from './detective'
import { NOIR } from './palette'
import page from './page.module.css'

// The profession switch as the game's menu: three crooked slabs, him in each costume with a flat red
// silhouette offset behind (the battle menu's outline), the label a heavy cut-out word. The pick swells
// and tilts with the red jag behind it. Picking a profession plays the cut-in once: a red diagonal band
// with his eyes in a strip sweeps across the screen and out.

// The jagged highlighter behind the pick, in a 200 by 100 box.
const JAG = 'M6 18 L60 4 L72 14 L150 0 L196 22 L184 46 L198 70 L132 96 L118 84 L40 100 L2 74 L14 50 Z'

function MenuSlab({ id, label, selected, optionProps }: ProfessionOption) {
  return (
    <button
      type="button"
      {...optionProps}
      className={`group relative flex min-h-[44px] w-full min-w-0 flex-col items-center bg-transparent px-1 pb-3 pt-2 text-[color:var(--noir-paper)] sm:w-44 sm:px-2 ${page.menuItem} ${DETECTIVE_HOST.badge}`}
    >
      <svg viewBox="0 0 200 100" preserveAspectRatio="none" className={`absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] ${page.jag}`} aria-hidden="true" focusable="false">
        <path d={JAG} fill={NOIR.red} />
      </svg>
      <span className={`relative flex w-full flex-col items-center ${page.slab} px-1 pb-2 pt-3 sm:px-2`}>
        {/* the picked slab's figure is the one the wardrobe names */}
        <span data-worlds-figure={selected ? '' : undefined} className={`block ${page.unskew}`}>
          <Detective profession={id} className={`h-24 w-16 sm:h-32 sm:w-20 ${page.redShadow}`} />
        </span>
        <span className={`mt-1 block text-center text-base uppercase leading-tight tracking-wider sm:text-2xl ${page.unskew} ${selected ? 'text-[color:var(--noir-paper)]' : 'text-[color:var(--noir-fog)]'}`}>
          {label}
        </span>
      </span>
    </button>
  )
}

/** His eyes in a strip, cropped from his figure (the eyes sit at y 17.5 of its 64 by 96 box). */
function EyeStrip({ profession }: { profession: Profession }) {
  return (
    <div className="relative h-24 w-full overflow-hidden bg-[color:var(--noir-paper)] sm:h-32">
      <Detective profession={profession} className="absolute left-1/2 top-1/2 h-[64rem] w-[42.6rem] -translate-x-1/2 -translate-y-[18.2%]" />
    </div>
  )
}

/**
 * The cut-in on a profession pick. It stays silent until the profession changes, and under reduced
 * motion; each later pick remounts it through its key so the sweep plays again, and it unmounts itself
 * when the sweep ends.
 */
function CutIn({ profession }: { profession: Profession }) {
  const reducedMotion = useReducedMotion()
  const [playing, setPlaying] = useState<Profession | null>(null)

  useOnChange(profession, (picked) => {
    if (reducedMotion) return
    setPlaying(picked)
  })

  if (!playing) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center overflow-hidden" aria-hidden="true">
      <div key={playing} className="relative w-full">
        <div className={`absolute -inset-x-10 -inset-y-10 bg-[color:var(--noir-red)] ${page.cutBand}`} />
        <div className={`relative border-y-4 border-[color:var(--noir-ink)] ${page.cutStrip}`} onAnimationEnd={() => setPlaying(null)}>
          <EyeStrip profession={playing} />
        </div>
      </div>
    </div>
  )
}

export function ProfessionMenu() {
  const { navigation } = useLabels()
  const { active } = useProfession()

  return (
    <>
      <ProfessionSwitch
        className="mx-auto grid max-w-xl grid-cols-3 gap-2 sm:flex sm:max-w-none sm:justify-center sm:gap-10"
        label={navigation.profession}
        renderOption={(option) => <MenuSlab {...option} />}
      />
      <CutIn profession={active} />
    </>
  )
}
