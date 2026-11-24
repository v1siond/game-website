'use client'

import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import { GumshoeSprite } from './gumshoe'
import { NOIR } from './palette'
import page from './page.module.css'

// The profession switch as the detective's case board: three crooked slabs, him side on in each costume
// the way the scenes draw him, the label a heavy word. The pick swells and tilts with a red folder behind
// it, the way a case file is pulled from the drawer.

// The red folder behind the pick, its tab at the top left, in a 200 by 100 box.
const FOLDER = 'M0 12 H18 L26 0 H86 L94 12 H200 V100 H0 Z'

function MenuSlab({ id, label, selected, optionProps }: ProfessionOption) {
  return (
    <button
      type="button"
      {...optionProps}
      className={`group relative flex min-h-[44px] w-full min-w-0 flex-col items-center bg-transparent px-1 pb-3 pt-2 text-[color:var(--noir-paper)] sm:w-44 sm:px-2 ${page.menuItem}`}
    >
      <svg viewBox="0 0 200 100" preserveAspectRatio="none" className={`absolute -inset-x-3 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] ${page.tab}`} aria-hidden="true" focusable="false">
        <path d={FOLDER} fill={NOIR.redPlate} />
      </svg>
      <span className={`relative flex w-full flex-col items-center ${page.slab} px-2 pb-3 pt-3 sm:px-3`}>
        {/* the picked slab's figure is the one the wardrobe names */}
        <span data-worlds-figure={selected ? '' : undefined} className={`block ${page.unskew}`}>
          <GumshoeSprite profession={id} className="h-24 w-16 sm:h-32 sm:w-20" />
        </span>
        <span className={`mt-1 block px-1 text-center text-base uppercase leading-tight tracking-wider sm:text-2xl ${page.unskew} ${selected ? 'text-[color:var(--noir-paper)]' : 'text-[color:var(--noir-fog)]'}`}>
          {label}
        </span>
      </span>
    </button>
  )
}

export function ProfessionMenu() {
  const { navigation } = useLabels()

  return (
    <ProfessionSwitch
      className="mx-auto grid max-w-xl grid-cols-3 gap-2 sm:flex sm:max-w-none sm:justify-center sm:gap-10"
      label={navigation.profession}
      renderOption={(option) => <MenuSlab {...option} />}
    />
  )
}
