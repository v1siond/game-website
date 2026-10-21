'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import { Rig } from './rigs'
import world from './world.module.css'

// The profession switch as the netrunner's quickhack menu: the three professions are programs in a
// list, each with its icon and its field; picking one uploads it (the bar fills in steps), then a
// glitch tears across his rig while the new place swaps in. The upload bar and the rig are keyed by
// the picked profession, so each pick plays the upload and the tear once.

const PROGRAM_ICON: Record<Profession, ReactNode> = {
  // a chip with its pins
  engineer: (
    <>
      <rect x={6} y={6} width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.6} />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" stroke="currentColor" strokeWidth={1.6} />
    </>
  ),
  // the jack and its lead
  drummer: (
    <>
      <rect x={9} y={2} width={6} height={10} fill="none" stroke="currentColor" strokeWidth={1.6} />
      <path d="M12 12v4 Q12 22 6 22" fill="none" stroke="currentColor" strokeWidth={1.6} />
    </>
  ),
  // the chrome forearm and fist
  fighter: (
    <>
      <path d="M4 20 L12 12" stroke="currentColor" strokeWidth={3} />
      <rect x={12} y={4} width={8} height={8} rx={2} fill="none" stroke="currentColor" strokeWidth={1.6} />
    </>
  ),
}

// The three bands of the tear over the rig: where, how tall, how far they throw.
const TEARS = [
  { y: '18%', h: '9%', x: '-14%', color: 'bg-[color:var(--neon-chrome-red)]' },
  { y: '47%', h: '5%', x: '11%', color: 'bg-[color:var(--neon-data)]' },
  { y: '71%', h: '12%', x: '-8%', color: 'bg-[color:var(--neon-hud)]' },
]

export function QuickhackMenu({ active }: { active: Profession }) {
  const { navigation, professionFields, cyber } = useLabels()

  return (
    <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-6">
      <div className={`${world.panel} p-3 sm:p-4`}>
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[color:var(--neon-hud)]" aria-hidden="true">
          {navigation.selectYourProfession}
        </p>
        <ProfessionSwitch
          className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-1"
          label={navigation.professionSelection}
          renderOption={({ id, label, selected, optionProps }) => (
            <button
              type="button"
              {...optionProps}
              className={`${world.program} ${world.cut} relative flex min-h-[44px] w-full flex-col gap-1 border border-[color-mix(in_srgb,var(--neon-chrome-red)_55%,transparent)] p-2 text-left sm:p-3 ${
                selected ? 'text-[color:var(--neon-hud)]' : 'text-[color:var(--neon-ice)] hover:bg-[color-mix(in_srgb,var(--neon-hud)_6%,transparent)]'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true" focusable="false">
                  {PROGRAM_ICON[id]}
                </svg>
                <span className="text-sm uppercase tracking-wider">{label}</span>
              </span>
              <span className="hidden text-sm text-[color:var(--neon-ash)] sm:block">{professionFields[id]}</span>
              {selected && (
                <span key={id} className="mt-1 block" aria-hidden="true">
                  <span className="relative block h-2 bg-[color-mix(in_srgb,var(--neon-hud)_15%,transparent)]">
                    <span className={`absolute inset-0 bg-[color:var(--neon-hud)] ${world.upload}`} />
                  </span>
                  <span className="relative mt-1 block h-5 text-sm uppercase tracking-wider">
                    <span className={`absolute left-0 top-0 ${world.upWord}`}>{cyber.uploading}</span>
                    <span className={`absolute left-0 top-0 text-[color:var(--neon-hack)] ${world.doneWord}`}>{navigation.active}</span>
                  </span>
                </span>
              )}
            </button>
          )}
        />
      </div>

      <div key={active} className="relative">
        <div className={world.rigIn}>
          <Rig profession={active} />
        </div>
        {TEARS.map(({ y, h, x, color }) => (
          <span
            key={y}
            className={`${world.tear} ${color}`}
            style={{ '--tear-y': y, '--tear-h': h, '--tear-x': x } as CSSProperties}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}
