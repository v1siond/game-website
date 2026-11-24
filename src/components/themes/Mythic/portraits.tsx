'use client'

import { memo } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { drumsSince } from '@/lib/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import type { Band, Musician } from '@/lib/cv/content'
import u from './underworld.module.css'

// The bands as painted portraits with their dialogue plates: each band a portrait plate with its initial in
// the laurel and a framed plate with its name, his role, the years and the release. Beside them his years on
// the drums and his line.

// Memoised: the list re-renders with the section, and a card only draws again when its band changes.
const BandCard = memo(function BandCard({ slot }: { slot: BandSlot }) {
  const { band, years, linkProps, release } = slot

  return (
    <article className={`flex gap-4 ${u.bandCard}`}>
      <div className={`relative flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden ${u.portrait}`} aria-hidden="true">
        <span className={`text-3xl text-[var(--myth-ink)] ${u.display}`}>{band.name.charAt(0)}</span>
      </div>
      <div className={`min-w-0 flex-1 p-4 ${u.dialogue}`}>
        <h3 className={`text-lg leading-tight text-[var(--myth-frost)] ${u.display}`}>
          {linkProps ? (
            <a {...linkProps} className="inline-flex min-h-[44px] items-center underline decoration-2 underline-offset-4">
              {band.name}
            </a>
          ) : (
            band.name
          )}
        </h3>
        <p className="mt-1 text-base">{band.role}</p>
        {years && <p className="text-sm text-[var(--myth-bone-shade)]">{years}</p>}
        {release && (
          <p className="mt-2 text-base italic text-[var(--myth-frost-core)]">
            <span className={`mr-2 text-sm not-italic text-[var(--myth-bone-shade)] ${u.display}`}>{release.label}</span>
            {release.title}
          </p>
        )}
      </div>
    </article>
  )
})

export function Portraits({ musician, bands }: { musician: Musician; bands: Band[] }) {
  const { years } = useLabels()

  return (
    <div className="grid gap-8">
      <div className={`p-5 ${u.panel} ${u.reveal}`}>
        <p className={`text-lg text-[var(--myth-frost)] ${u.display}`}>{drumsSince(musician, years)}</p>
        {musician.line && <p className="mt-2 text-base leading-relaxed">{musician.line}</p>}
      </div>
      <div data-stage-items="">
        <BandList bands={bands} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot) => <BandCard slot={slot} />} />
      </div>
    </div>
  )
}
