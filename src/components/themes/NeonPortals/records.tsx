'use client'

import type { CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { BandSlot } from '@/components/cv/BandList'
import { Gem, Swirl, type SwirlTone } from './art'
import world from './world.module.css'

// The musician's bands and the fighter's record, each in the world's own reward language.
// - A band is a bonus warp: a small portal swirl beside its name that spins up when pointed at or
//   focused, and the band's card lifts off its pad like the hub's hologram.
// - A Muay Thai achievement is a gem awarded at the end of a level: the gem drops in spinning and lands
//   with a bounce, one after another, the line beside it slides in; pointing at a line spins its gem
//   again.

const BAND_TONES: SwirlTone[] = ['VIOLET', 'BLUE', 'ORANGE', 'GREEN']

export function BandWarp({ slot, index }: { slot: BandSlot; index: number }) {
  const { links } = useLabels()
  const { band, years, linkProps } = slot

  const body = (
    <span className="flex items-start gap-4 p-5">
      <span className={`relative block h-16 w-12 shrink-0 overflow-hidden rounded-[50%] border-4 border-[color:var(--np-stone)] ${world.bandPortal}`} aria-hidden="true">
        <Swirl tone={BAND_TONES[index % BAND_TONES.length]} className="h-full w-full" arms={world.bandArms} />
      </span>
      <span className="block min-w-0">
        <span className={`block text-xl leading-tight ${world.display}`}>{band.name}</span>
        <span className="mt-1 block text-sm font-bold uppercase tracking-wide text-[color:var(--np-violet)]">{band.role}</span>
        {years && <span className="mt-1 block text-sm text-[color:var(--np-gold)]">{years}</span>}
        {band.release && (
          <span className="mt-2 block text-base text-[color:var(--np-white)]">
            {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
          </span>
        )}
      </span>
    </span>
  )

  const look = `block rounded-2xl border-4 border-[color:var(--np-stone-dark)] bg-[color:var(--np-panel)] ${world.bandCard}`

  return linkProps ? (
    <a {...linkProps} className={`${look} focus:outline-none`} style={{ '--i': index } as CSSProperties}>
      {body}
    </a>
  ) : (
    <article className={look} style={{ '--i': index } as CSSProperties}>
      {body}
    </article>
  )
}

const GEM_TONES = ['url(#np-gem)', 'url(#np-crystal)', 'url(#np-fruit)', 'url(#np-gem)']

export function GemLine({ achievement, index }: { achievement: string; index: number }) {
  return (
    <span className={`flex items-center gap-4 ${world.gemLine}`} style={{ '--i': index } as CSSProperties}>
      <span className={`block h-12 w-10 shrink-0 ${world.gemDrop}`} aria-hidden="true">
        <Gem className={`h-full w-full ${world.gemSpin}`} tone={GEM_TONES[index % GEM_TONES.length]} />
      </span>
      <span className={`block flex-1 rounded-xl border-4 border-[color:var(--np-stone-dark)] bg-[color:var(--np-panel)] px-4 py-3 text-base text-[color:var(--np-white)] ${world.gemText}`}>
        {achievement}
      </span>
    </span>
  )
}
