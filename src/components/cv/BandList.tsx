import { useMemo, type ReactNode } from 'react'
import type { Band } from '@/lib/cv/content'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import { useLabels } from './CVDataProvider'
import { newTabName, yearSpan } from '@/lib/cv/sectionText'

// The bands (R5) as a list without a look, in the order viewFor gives (current first). A band with a
// site carries `linkProps` for the world's anchor; one without carries null and is drawn as text. A link
// whose visible text is a word ("Website") rather than the band's name takes its accessible name from
// `nameFor(word)`, so the name holds the visible word (WCAG 2.5.3 label in name).

export interface BandSlot {
  band: Band
  years: string
  linkProps: { href: string; target: '_blank'; rel: string; 'aria-label': string } | null
  /** "Website of {band} (opens in a new tab)" for a link that reads "Website". */
  nameFor: (visibleText: string) => string
  /** The release line's parts, labels.links.released and the title; null for a band with no release.
   *  The world adds its own punctuation and quotes. */
  release: { label: string; title: string } | null
}

interface BandListProps {
  bands: Band[]
  /** `index` is the band's place in `bands`. */
  renderBand: (slot: BandSlot, index: number) => ReactNode
  className?: string
  itemClassName?: string
}

const slotFor = (band: Band, labels: Labels): BandSlot => ({
  band,
  years: yearSpan(band, labels.years),
  linkProps: band.url
    ? { href: band.url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': newTabName(labels.links, band.name) }
    : null,
  nameFor: (visibleText) => newTabName(labels.links, fillLabel(labels.links.linkOf, { link: visibleText, project: band.name })),
  release: band.release ? { label: labels.links.released, title: band.release } : null,
})

export function BandList({ bands, renderBand, className, itemClassName }: BandListProps) {
  const labels = useLabels()
  // One slot object per band for as long as the bands and labels stay, so a memo card fed a slot skips
  // the parent's unrelated renders.
  const slots = useMemo(() => bands.map((band) => slotFor(band, labels)), [bands, labels])
  return (
    <ul className={className}>
      {slots.map((slot, index) => (
        <li key={slot.band.id} className={itemClassName}>
          {renderBand(slot, index)}
        </li>
      ))}
    </ul>
  )
}
