'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { drumsSince } from '@/components/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import type { Band, Musician } from '@/lib/cv/content'
import { SpartanSprite } from './sprite'
import { useMove } from './moves'
import u from './underworld.module.css'

// The bands as the portraits and dialogue boxes of the house: each band a painted portrait plate with
// its initial in the laurel and a framed dialogue box with its name, his role, the years and the release.
// Beside them he stands at the great war drum; pointing at or focusing a band, he brings the hilts down
// on the skin and fire bursts from it.

function BandCard({ slot, onStrike }: { slot: BandSlot; onStrike: () => void }) {
  const { links } = useLabels()
  const { band, years, linkProps } = slot

  return (
    <article className={`flex gap-4 ${u.bandCard}`} onPointerEnter={onStrike} onFocus={onStrike}>
      <div className={`flex h-24 w-20 shrink-0 items-center justify-center ${u.portrait}`} aria-hidden="true">
        <span className={`text-3xl text-[var(--myth-ink)] ${u.display}`}>{band.name.charAt(0)}</span>
      </div>
      <div className={`min-w-0 flex-1 p-4 ${u.dialogue}`}>
        <h3 className={`text-lg leading-tight text-[var(--myth-gold)] ${u.display}`}>
          {linkProps ? (
            <a {...linkProps} className="underline decoration-2 underline-offset-4">
              {band.name}
            </a>
          ) : (
            band.name
          )}
        </h3>
        <p className="mt-1 text-base">{band.role}</p>
        {years && <p className="text-sm text-[var(--myth-bone-shade)]">{years}</p>}
        {band.release && (
          <p className="mt-2 text-base italic text-[var(--myth-gold-pale)]">
            <span className={`mr-2 text-sm not-italic text-[var(--myth-bone-shade)] ${u.display}`}>{links.released}</span>
            {band.release}
          </p>
        )}
      </div>
    </article>
  )
}

export function Portraits({ musician, bands }: { musician: Musician; bands: Band[] }) {
  const { years, myth } = useLabels()
  const { motion, take, play } = useMove('drummer')

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className={`p-5 ${u.panel} ${u.reveal} lg:sticky lg:top-8 lg:self-start`}>
        <div className="mx-auto h-64 w-52" aria-hidden="true">
          <SpartanSprite key={take} profession="drummer" motion={motion} className="h-full w-full" />
        </div>
        <p className={`mt-4 text-lg text-[var(--myth-gold)] ${u.display}`}>{drumsSince(musician, years)}</p>
        {musician.line && <p className="mt-2 text-base leading-relaxed">{musician.line}</p>}
        <p className={`mt-4 ${u.hint}`}>{myth.drumHint}</p>
      </div>
      <BandList
        bands={bands}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => <BandCard slot={slot} onStrike={() => play('action')} />}
      />
    </div>
  )
}
