import type { Musician } from '@/lib/cv/content'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM } from '@/lib/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { drumsSince } from '@/lib/cv/sectionText'
import { CARD_BUTTON } from './actions'
import { COLUMN_LIST, Mark } from './cards'
import look from './world.module.css'

// Bands as the house's papers, one per band, for the lamps he lights down the gallery behind the page
// (./scenes): the band's name, his role and the years, the release and the band's link.

function BandCard({ slot }: { slot: BandSlot }) {
  const { band, years, linkProps, release } = slot

  return (
    <article className={`p-4 ${look.file}`}>
      <div className="flex items-start gap-3">
        <Mark />
        <div className="min-w-0">
          <h3 className="text-base text-[color:var(--sh-ivory)]">{band.name}</h3>
          <p className="text-sm text-[color:var(--sh-brass-text)]">
            {band.role}
            {years && <span aria-hidden="true"> | </span>}
            {years}
          </p>
        </div>
      </div>
      {release && (
        <p className="mt-3 text-sm text-[color:var(--sh-cream)]">
          {release.label} <cite>&ldquo;{release.title}&rdquo;</cite>
        </p>
      )}
      {linkProps && (
        <a {...linkProps} className={`${CARD_BUTTON} mt-3 border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-flame-text)] hover:border-[color:var(--sh-flame)]`}>
          {band.name}
        </a>
      )}
    </article>
  )
}

export function BandPapers({ musician, bands }: { musician: Musician; bands: BandSlot['band'][] }) {
  const { years } = useLabels()

  return (
    <>
      <p className="mb-6 text-base leading-relaxed text-[color:var(--sh-cream)]">{drumsSince(musician, years)}</p>
      <div data-stage-items="">
        <BandList bands={bands} className={COLUMN_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot) => <BandCard slot={slot} />} />
      </div>
      <p className="mt-2 text-sm italic text-[color:var(--sh-cream)]">{musician.line}</p>
    </>
  )
}
